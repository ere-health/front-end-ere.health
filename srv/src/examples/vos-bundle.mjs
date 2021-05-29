export const vosBundle = `
<Bundle xmlns="http://hl7.org/fhir">
    <id value="b97e55f4-3900-4505-a277-75cd93baede5" />
    <meta>
        <lastUpdated value="2019-12-24T12:30:02Z" />
        <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Bundle_PVS_VoS|1.10.010" />
    </meta>
    <identifier>
        <system value="http://praxis-topp-gluecklich.de/vosbundle" />
        <value value="6413570d-d8ce-4afa-9f6e-0950111a4cb8" />
    </identifier>
    <type value="document" />
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Composition/dcdeee3f-63b2-4df7-ad27-7d8b7f68981a" />
        <resource>
            <Composition>
                <id value="dcdeee3f-63b2-4df7-ad27-7d8b7f68981a" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Composition|1.10.010" />
                </meta>
                <status value="final" />
                <type>
                    <coding>
                        <system value="http://loinc.org" />
                        <code value="11503-0" />
                    </coding>
                </type>
                <subject>
                    <extension url="https://fhir.kbv.de/StructureDefinition/74_EX_VoS_AufrufKontext">
                        <valueCodeableConcept>
                            <coding>
                                <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_AufrufKontext" />
                                <code value="2" />
                            </coding>
                        </valueCodeableConcept>
                    </extension>
                    <display value="Aufrufkontext" />
                </subject>
                <date value="2018-07-01T12:30:02Z" />
                <author>
                    <reference value="Practitioner/45a270f3-5eef-4fac-b70a-03ae8e0ffd36" />
                    <identifier>
                        <type>
                            <coding>
                                <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_AuthorTyp" />
                                <code value="Anwender" />
                            </coding>
                        </type>
                    </identifier>
                </author>
                <author>
                    <reference value="Device/aabd5e76-6360-4114-8926-8ac4c3838659" />
                    <identifier>
                        <type>
                            <coding>
                                <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_AuthorTyp" />
                                <code value="System" />
                            </coding>
                        </type>
                    </identifier>
                </author>
                <title value="Verordnungsdaten" />
                <custodian>
                    <reference value="Organization/cf042e44-086a-4d51-9c77-172f9a972e3b" />
                </custodian>
                <section>
                    <entry>
                        <reference value="PractitionerRole/a24c9cd2-c55e-4859-8d41-db419fc9f6b1" />
                    </entry>
                    <entry>
                        <reference value="Coverage/3b1f3bca-bdba-4642-8298-05f2d9ef9362" />
                    </entry>
                    <entry>
                        <reference value="Practitioner/20597e0e-cb2a-45b3-95f0-dc3dbdb617c3" />
                    </entry>
                    <entry>
                        <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                    </entry>
                    <entry>
                        <reference value="AllergyIntolerance/7270c407-4511-4c90-9c8d-cf1c237f716a" />
                    </entry>
                    <entry>
                        <reference value="Observation/58f1bdc7-6cc8-46d1-9b80-0b52c1b5f7b3" />
                    </entry>
                    <entry>
                        <reference value="Observation/0f33c6b0-9054-4b0f-b1c2-e2707da946c3" />
                    </entry>
                    <entry>
                        <reference value="Observation/41ec7bc4-6014-489a-b6bd-b2b8005bcad8" />
                    </entry>
                    <entry>
                        <reference value="Observation/51d18de8-1210-420a-be04-b8f5c632d5cd" />
                    </entry>
                    <entry>
                        <reference value="Observation/d2688ffb-995a-4977-8a8f-a7b00ba68fc" />
                    </entry>
                </section>
            </Composition>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Practitioner/20597e0e-cb2a-45b3-95f0-dc3dbdb617c3" />
        <resource>
            <Practitioner>
                <id value="20597e0e-cb2a-45b3-95f0-dc3dbdb617c3" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Behandelnder|1.10.010" />
                </meta>
                <identifier>
                    <system value="http://fhir.de/NamingSystem/kbv/lanr" />
                    <value value="123456667" />
                </identifier>
                <name>
                    <family value="Topp-Gl&#252;cklich">
                        <extension url="http://hl7.org/fhir/StructureDefinition/humanname-own-name">
                            <valueString value="Topp-Gl&#252;cklich" />
                        </extension>
                    </family>
                    <given value="Hans" />
                    <prefix value="Dr. med." />
                </name>
                <telecom>
                    <system value="phone" />
                    <value value="06151/1111111" />
                </telecom>
            </Practitioner>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
        <resource>
            <Patient>
                <id value="9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Patient|1.10.010" />
                </meta>
                <identifier>
                    <system value="http://praxis-topp-gluecklich.de/patient" />
                    <value value="3" />
                </identifier>
                <name>
                    <text value="Eva Maria Klogerich" />
                    <family value="Kluge">
                        <extension url="http://hl7.org/fhir/StructureDefinition/humanname-own-name">
                            <valueString value="Klogerich" />
                        </extension>
                    </family>
                    <given value="Eva Maria" />
                </name>
                <gender value="female" />
                <birthDate value="1955-01-03" />
                <address>
                    <use value="home" />
                    <type value="physical" />
                    <text value="Keine Stra&#223;e 345, 12354 Sonstwo" />
                    <line value="Keine Stra&#223;e 345">
                        <extension url="http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName">
                            <valueString value="Keine Stra&#223;e" />
                        </extension>
                        <extension url="http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber">
                            <valueString value="345" />
                        </extension>
                    </line>
                    <city value="Sonstwo" />
                    <postalCode value="12354" />
                    <country value="DE" />
                </address>
            </Patient>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/PractitionerRole/a24c9cd2-c55e-4859-8d41-db419fc9f6b1" />
        <resource>
            <PractitionerRole>
                <id value="a24c9cd2-c55e-4859-8d41-db419fc9f6b1" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_BehandelnderRolle|1.10.010" />
                </meta>
                <extension url="https://fhir.kbv.de/StructureDefinition/74_EX_VoS_KennzeichenStatus">
                    <valueCodeableConcept>
                        <coding>
                            <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_KennzeichenStatus" />
                            <code value="01" />
                        </coding>
                    </valueCodeableConcept>
                </extension>
                <practitioner>
                    <reference value="Practitioner/20597e0e-cb2a-45b3-95f0-dc3dbdb617c3" />
                </practitioner>
                <organization>
                    <identifier>
                        <system value="http://fhir.de/NamingSystem/asv/teamnummer" />
                        <value value="123456234" />
                    </identifier>
                </organization>
            </PractitionerRole>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Organization/cf042e44-086a-4d51-9c77-172f9a972e3b" />
        <resource>
            <Organization>
                <id value="cf042e44-086a-4d51-9c77-172f9a972e3b" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Betriebsstaette|1.10.010" />
                </meta>
                <identifier>
                    <system value="http://fhir.de/NamingSystem/kbv/bsnr" />
                    <value value="781234567" />
                </identifier>
                <name value="Dr. med. Hans Topp-Gl&#252;cklich" />
                <telecom>
                    <system value="fax" />
                    <value value="06151/2222222" />
                </telecom>
                <address>
                    <line value="Musterstr. 1">
                        <extension url="http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName">
                            <valueString value="Musterstr." />
                        </extension>
                        <extension url="http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber">
                            <valueString value="1" />
                        </extension>
                    </line>
                    <city value="Rostock" />
                    <postalCode value="18107" />
                </address>
            </Organization>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Coverage/3b1f3bca-bdba-4642-8298-05f2d9ef9362" />
        <resource>
            <Coverage>
                <id value="3b1f3bca-bdba-4642-8298-05f2d9ef9362" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Kostentraeger|1.10.010" />
                </meta>
                <extension url="http://fhir.de/StructureDefinition/gkv/zusatzinfos-geschuetzt/0.2">
                    <extension url="besonderePersonengruppe">
                        <valueCode value="00" />
                    </extension>
                    <extension url="dmpKennzeichnung">
                        <valueCode value="00" />
                    </extension>
                    <extension url="zuzahlungsstatus">
                        <extension url="status">
                            <valueCode value="0" />
                        </extension>
                    </extension>
                    <extension url="selektivvertraege">
                        <extension url="aerztlich">
                            <valueCode value="9" />
                        </extension>
                        <extension url="zahnaerztlich">
                            <valueCode value="9" />
                        </extension>
                    </extension>
                </extension>
                <extension url="http://fhir.de/StructureDefinition/gkv/zusatzinfos-allgemein/0.2">
                    <extension url="versichertenart">
                        <valueCode value="3" />
                    </extension>
                    <extension url="wop">
                        <valueCode value="38" />
                    </extension>
                </extension>
                <identifier>
                    <system value="http://fhir.de/NamingSystem/gkv/kvid-10" />
                    <value value="K030182229" />
                </identifier>
                <status value="active" />
                <type>
                    <coding>
                        <system value="http://fhir.de/CodeSystem/versicherungsart-de-basis" />
                        <code value="GKV" />
                    </coding>
                </type>
                <beneficiary>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </beneficiary>
                <period>
                    <start value="2011-01-01" />
                </period>
                <payor>
                    <identifier>
                        <system value="http://fhir.de/NamingSystem/arge-ik/iknr" />
                        <value value="109777509" />
                    </identifier>
                    <display value="Techniker-Krankenkasse" />
                </payor>
            </Coverage>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Device/aabd5e76-6360-4114-8926-8ac4c3838659" />
        <resource>
            <Device>
                <id value="aabd5e76-6360-4114-8926-8ac4c3838659" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_System|1.10.010" />
                </meta>
                <extension url="https://fhir.kbv.de/StructureDefinition/74_EX_VoS_PruefNummer">
                    <valueIdentifier>
                        <system value="https://fhir.kbv.de/NamingSystem/74_NS_VoS_KBV-Pruefnummer" />
                        <value value="Y/1/1806/36/000" />
                    </valueIdentifier>
                </extension>
                <identifier>
                    <value value="000" />
                </identifier>
            </Device>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Practitioner/45a270f3-5eef-4fac-b70a-03ae8e0ffd36" />
        <resource>
            <Practitioner>
                <id value="45a270f3-5eef-4fac-b70a-03ae8e0ffd36" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Anwender|1.10.010" />
                </meta>
                <identifier>
                    <system value="http://praxis-topp-gluecklich.de/benutzer" />
                    <value value="bsp_anwender_pvs" />
                </identifier>
                <name>
                    <family value="Anwender" />
                    <given value="Beispiel" />
                </name>
            </Practitioner>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/AllergyIntolerance/7270c407-4511-4c90-9c8d-cf1c237f716a" />
        <resource>
            <AllergyIntolerance>
                <id value="7270c407-4511-4c90-9c8d-cf1c237f716a" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_Allergie|1.10.010" />
                </meta>
                <clinicalStatus value="active" />
                <verificationStatus value="confirmed" />
                <code>
                    <text value="Luftallergie" />
                </code>
                <patient>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </patient>
                <reaction>
                    <substance>
                        <coding>
                            <system value="http://www.whocc.no/atc" />
                            <code value="J01CA04" />
                        </coding>
                    </substance>
                    <manifestation>
                        <text value="Hautverf&#195;&#164;rbung" />
                    </manifestation>
                </reaction>
            </AllergyIntolerance>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Observation/58f1bdc7-6cc8-46d1-9b80-0b52c1b5f7b3" />
        <resource>
            <Observation>
                <id value="58f1bdc7-6cc8-46d1-9b80-0b52c1b5f7b3" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_OBS_Gewicht|1.10.010" />
                </meta>
                <status value="final" />
                <code>
                    <coding>
                        <system value="http://loinc.org" />
                        <code value="29463-7" />
                    </coding>
                    <coding>
                        <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_Koerperkenngroessen" />
                        <code value="Koerpergewicht" />
                    </coding>
                </code>
                <subject>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </subject>
                <valueQuantity>
                    <value value="60" />
                    <unit value="kg" />
                    <system value="http://unitsofmeasure.org" />
                    <code value="kg" />
                </valueQuantity>
            </Observation>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Observation/0f33c6b0-9054-4b0f-b1c2-e2707da946c3" />
        <resource>
            <Observation>
                <id value="0f33c6b0-9054-4b0f-b1c2-e2707da946c3" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_OBS_Koerpergroesse|1.10.010" />
                </meta>
                <status value="final" />
                <code>
                    <coding>
                        <system value="http://loinc.org" />
                        <code value="8302-2" />
                    </coding>
                    <coding>
                        <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_Koerperkenngroessen" />
                        <code value="Koerpergroesse" />
                    </coding>
                </code>
                <subject>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </subject>
                <valueQuantity>
                    <value value="172" />
                    <unit value="cm" />
                    <system value="http://unitsofmeasure.org" />
                    <code value="cm" />
                </valueQuantity>
            </Observation>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Observation/41ec7bc4-6014-489a-b6bd-b2b8005bcad8" />
        <resource>
            <Observation>
                <id value="41ec7bc4-6014-489a-b6bd-b2b8005bcad8" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_OBS_Kreatininwert|1.10.010" />
                </meta>
                <status value="final" />
                <code>
                    <coding>
                        <system value="http://loinc.org" />
                        <code value="2160-0" />
                    </coding>
                    <coding>
                        <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_Koerperkenngroessen" />
                        <code value="Kreatinin" />
                    </coding>
                </code>
                <subject>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </subject>
                <valueQuantity>
                    <value value="60" />
                    <unit value="mg/dl" />
                    <system value="http://unitsofmeasure.org" />
                    <code value="mg/dl" />
                </valueQuantity>
            </Observation>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Observation/51d18de8-1210-420a-be04-b8f5c632d5cd" />
        <resource>
            <Observation>
                <id value="51d18de8-1210-420a-be04-b8f5c632d5cd" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_OBS_Schwanger|1.10.010" />
                </meta>
                <status value="final" />
                <code>
                    <coding>
                        <system value="http://loinc.org" />
                        <code value="11449-6" />
                    </coding>
                    <coding>
                        <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_Koerperkenngroessen" />
                        <code value="Schwangerschaft" />
                    </coding>
                </code>
                <subject>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </subject>
                <valueBoolean value="true" />
                <component>
                    <code>
                        <coding>
                            <system value="http://loinc.org" />
                            <code value="11778-8" />
                        </coding>
                    </code>
                    <valueDateTime value="2015-02-28" />
                </component>
            </Observation>
        </resource>
    </entry>
    <entry>
        <fullUrl value="http://pvs.praxis-topp-gluecklich.local/fhir/Observation/d2688ffb-995a-4977-8a8f-a7b00ba68fc" />
        <resource>
            <Observation>
                <id value="d2688ffb-995a-4977-8a8f-a7b00ba68fc" />
                <meta>
                    <profile value="https://fhir.kbv.de/StructureDefinition/74_PR_VoS_OBS_Stillend|1.10.010" />
                </meta>
                <status value="final" />
                <code>
                    <coding>
                        <system value="http://loinc.org" />
                        <code value="63895-7" />
                    </coding>
                    <coding>
                        <system value="https://fhir.kbv.de/CodeSystem/74_CS_VoS_Koerperkenngroessen" />
                        <code value="Stillend" />
                    </coding>
                </code>
                <subject>
                    <reference value="Patient/9c59e79c-7f2f-4181-b5ee-477b18b4d7c3" />
                </subject>
                <valueBoolean value="true" />
            </Observation>
        </resource>
    </entry>
</Bundle>
`;