/**
 * Base path token
 */
class PathToken {
  constructor(type) {
    this.type = type;
  }
}

/**
 * Segment of path, equal to field name
 */
class PathTokenSegment extends PathToken {
  constructor(name) {
    super("SEGMENT");

    this.name = name;
  }
}

/**
 * Array indexer, can be of 2 forms :
 * --> Number = Direct index access
 * --> String = Path with condition
 *    -- Ex : To find the entry for Patient before getting the name we need to specify a condition to find the entry in an array
 *            Direct Mapping is not possible
 *            entry[resource.resourceType?Patient].identity.given.name will first lookup on each entry item to look for "resource.resourceType" path with value contains "Patient"
 *            Then read the path "identity.given.name"
 */
class PathTokenArray extends PathToken {
  /**
   * Create a new token of Array Type
   * @param {number} index Array Index to follow
   * @param {string} path Path to follow
   * @param {string|number} filter Applay thge operator to check the condition
   * @param {string} operator Operator to apply
   */
  constructor(index, path, filter, operator) {
    super("ARRAY");
    
    this.index    = index;
    this.path     = path;    
    this.filter   = filter;  
    this.operator = operator;
  }
}

/**
 * The mapper class wrap an object to allow safe read and write by 
 * using a path or a Conditional Subpath
 */
export class Mapper {
  static STATES = {
    OPEN_ARRAY  : "OPEN_ARRAY", 
    CLOSE_ARRAY : "CLOSE_ARRAY",
    FILTER      : "FILTER",     
    END_SEGMENT : "END_SEGMENT",
    SEGMENT     : "SEGMENT"     
  };

  constructor(mapObject) {
    this.mapObject = mapObject;
  }

  write(path, value, forceMapObject) {
    if (path === null) return;
    const pathDefinition = typeof path === "string" ? this.tokenizePath(path) : path;

    let cursor = forceMapObject ?? this.mapObject;
    let prevCursor = cursor;
    let prevPath = "";

    pathDefinition.forEach(pathToken => {
      if (cursor === void 0) return;
      switch(pathToken.type) {
        case "SEGMENT":
          if (!cursor[pathToken.name]) {
            cursor[pathToken.name] = {};
          }
          prevCursor = cursor;
          prevPath = pathToken.name;
          cursor = cursor[pathToken.name];
          break;
        case "ARRAY":
          if (pathToken.index !== null) {
            if (!Array.isArray(cursor)) {
              if (Object.entries(cursor).length === 0) {
                prevCursor[prevPath] = [];
                cursor = prevCursor[prevPath];
                cursor[pathToken.index] = {};
              }
            }
            prevCursor = cursor;
            prevPath = pathToken.index;
            cursor = cursor[pathToken.index];
            return;
          }
          if (pathToken.path) {
            // Recursive path
            if (!Array.isArray(cursor)) {
              prevCursor[prevPath] = [];
              cursor = prevCursor[prevPath];
            }
            if (cursor.length === 0) {
              const elt = this.write(pathToken.path, pathToken.filter, {});
              cursor.push(elt);
            }
            cursor.forEach(_tmpCur => {
              const tmpCursor = this.read(pathToken.path, void 0, _tmpCur);
              switch(pathToken.operator) {
                case "?":
                    if (tmpCursor.toString().includes(pathToken.filter.toString())) {
                      cursor = _tmpCur;
                      return;
                    }
                  break;
                case "=":
                    if (tmpCursor.toString() === pathToken.filter.toString()) {
                      cursor = _tmpCur;
                      return;
                    }
                  break;
                  case "/":
                    if (tmpCursor) {
                      cursor = _tmpCur;
                      return;
                    }
                  break;
              }
            });
          }

          break;
      }
    });
    try {
      prevCursor[prevPath] = value
    } catch(ex) { console.warn(ex) }

    return forceMapObject ?? this.mapObject;
  }

  read(path, defaultValue, forceMapObject) {
    if (path === null) return;
    const pathDefinition = typeof path === "string" ? this.tokenizePath(path) : path;

    let cursor = forceMapObject ?? this.mapObject;
    pathDefinition.forEach(pathToken => {
      if (cursor === void 0) return;
      switch(pathToken.type) {
        case "SEGMENT":
          cursor = cursor[pathToken.name];
          break;
        case "ARRAY":
          if (pathToken.index !== null) {
            cursor = cursor[pathToken.index];
            return;
          }
          if (pathToken.path) {
            // Recursive path
            if (!Array.isArray(cursor)) {
              return defaultValue;
            }
            cursor.forEach(_tmpCur => {
              const tmpCursor = this.read(pathToken.path, void 0, _tmpCur);
              switch(pathToken.operator) {
                case "?":
                    if (tmpCursor.toString().includes(pathToken.filter.toString())) {
                      cursor = _tmpCur;
                      return;
                    }
                  break;
                case "=":
                    if (tmpCursor === pathToken.filter) {
                      cursor = _tmpCur;
                      return;
                    }
                  break;
                  case "/":
                    if (tmpCursor) {
                      cursor = _tmpCur;
                      return;
                    }
                  break;
              }
            });
          }

          break;
      }
    });

    let finalValue = cursor ?? defaultValue;

    switch(finalValue) {
      case "$$$":
        finalValue = "";
      break;
      case "9999-12-28":
        finalValue = "";
      break;
    }
    
    return finalValue;
  }

  /**
   * Convert a path into tokens
   * @param {string} path The Json path
   * @returns {(PathTokenSegment | PathTokenArray)[]}
   */
  tokenizePath(path) {
    let arrayDepthLevel = 0;                    
    const tokens        = [];                   
    let curState        = Mapper.STATES.SEGMENT;
    let curBuffer       = "";                   
    let curArrayPath    = "";                   
    let curOperator     = "";                   

    const flush = () => {
      const res = curBuffer;
      curBuffer = "";
      return res;
    }

    path.split("").forEach((char, index, chars) => {
      switch(char) {
        case "[":
          if (curState === Mapper.STATES.OPEN_ARRAY) {
            arrayDepthLevel++;
            curBuffer += char;
            return;
          }

          if (curBuffer.length) {
            const segment = flush();
            tokens.push(new PathTokenSegment(segment));
          }
          curState = Mapper.STATES.OPEN_ARRAY;
          break;
        case "]":
          if (arrayDepthLevel) {
            arrayDepthLevel--;
            curBuffer += char;
            return;
          }
          if (curState === Mapper.STATES.OPEN_ARRAY) {
            const elt = isNaN(curBuffer) ? this.tokenizePath(flush()) : Number(flush());
            if (typeof elt === "number") {
              tokens.push(new PathTokenArray(elt, null, null, null));
            } else {
              tokens.push(new PathTokenArray(null, elt, null, "/")); 
            }
          }
          if (curState === Mapper.STATES.FILTER) {
            tokens.push(new PathTokenArray(null, this.tokenizePath(curArrayPath), flush(), curOperator));
            curArrayPath = "";
            curOperator  = "";
          }
          curState = Mapper.STATES.CLOSE_ARRAY;
          break;
        case ".":
          // Ignore path when indexing an array
          if (curState === Mapper.STATES.OPEN_ARRAY) {
            curBuffer += char;
            return;
          }
          if (curState === Mapper.STATES.CLOSE_ARRAY) {
            curState = Mapper.STATES.END_SEGMENT;
            return;
          }
          tokens.push(new PathTokenSegment(flush()));
          curState = Mapper.STATES.END_SEGMENT;
          break;
        case "/": // == true (Use falsy values)
        case "=": // Equal
        case ">": // greater
        case "<": // less
        case "?": // Contains
        case "-": // less or equal
        case "+": // greater or equal
          if (arrayDepthLevel) {
            curBuffer += char;
            return;
          }
          curArrayPath = flush();
          curOperator = char;
          curState = Mapper.STATES.FILTER;
          break;
        default: 
          curBuffer += char;
          break;
      }
    });

    if (curBuffer) {
      tokens.push(new PathTokenSegment(flush()));
    }

    return tokens;
  }
}

window.Mapper = Mapper;