# Delta for citability-engine

## Racional (ES)

El engine solo reconoce patrones de answer block en inglés; un landing en español (relevy.app, page score 49.9) no dispara ninguno: 25 bloques en `ans: 20`, citabilidad sub-calificada. Este delta exige patrones léxicos bilingües EN+ES en el scorer, sin tocar pesos ni contenido y sin regresión EN.

## ADDED Requirements

### Requirement: Spanish Definition Pattern Recognition (REQ-21.1)

`DEFINITION_PATTERN` MUST recognize "es un/una" and "son unos/unas" with the same strength as English "is a/an". A Spanish block containing a definition SHALL earn the definition bonus exactly like an English one.

#### Scenario: Spanish definition earns answer credit

- GIVEN an ES block whose lead starts "Relevy es una plataforma de auditoría GEO/SEO que analiza la visibilidad en buscadores de IA"
- WHEN Answer Block Quality is scored
- THEN the answer score is ≥ 60

#### Scenario: Plural definition "son unos/unas" is recognized

- GIVEN an ES block whose lead contains "estos datos son unas señales directas de autoridad temática"
- WHEN Answer Block Quality is scored
- THEN the answer score is ≥ 60

### Requirement: Spanish Answer Copula Recognition (REQ-21.2)

`ANSWER_COPULA` MUST recognize "es/son/era/eran/fue/fueron" like "is/are/was/were". A Spanish block whose first sentence is complete and declarative SHALL earn the first-sentence answer bonus under the same 60-word rule as English.

#### Scenario: Declarative Spanish first sentence earns the answer bonus

- GIVEN an ES block whose first sentence is "El análisis es completo y cubre las cinco dimensiones de visibilidad."
- WHEN Answer Block Quality is scored
- THEN the answer score is ≥ 60

#### Scenario: Past-tense copula qualifies

- GIVEN an ES block whose first sentence is "El estudio fue realizado sobre 200 sitios en español."
- WHEN Answer Block Quality is scored
- THEN the answer score is ≥ 60

### Requirement: Spanish Uniqueness Signal Recognition (REQ-21.3)

`FIRST_PERSON_LEAD` MUST recognize "nuestro/nuestra/nosotros"; `UNIQUENESS_PHRASES` MUST include "encuestamos, analizamos, nuestro análisis, nuestros datos, nuestra investigación, nuestros hallazgos, encontramos, en nuestra experiencia". Spanish blocks SHALL earn the same per-hit credit as English (floor 35 + 35, cap 100).

#### Scenario: Spanish first-person lead adds credit

- GIVEN an ES block starting "Nosotros encuestamos a 120 especialistas en GEO"
- WHEN Uniqueness is scored
- THEN the score is ≥ 70

#### Scenario: Unique-data phrase in the body adds credit

- GIVEN an ES block whose body contains "según nuestra investigación, los buscadores de IA citan con más frecuencia"
- WHEN Uniqueness is scored
- THEN the score is ≥ 70

### Requirement: Spanish Bad-Lead Penalty (REQ-21.4)

`PRONOUN_LEAD` MUST recognize "esto/eso/aquello/este/esta/estos/estas"; `CONJUNCTION_LEAD` "pero/sin embargo/y además/así que/aunque". A Spanish block led by a pronoun or conjunction SHALL be penalized like an English one — Self-Containment < 30.

#### Scenario: Spanish pronoun lead is penalized

- GIVEN an ES block starting "Esto significa que los buscadores de IA priorizan contenido citable"
- WHEN Self-Containment is scored
- THEN the score is < 30

#### Scenario: Spanish conjunction lead is penalized

- GIVEN an ES block starting "Sin embargo, el estudio solo cubre una muestra pequeña"
- WHEN Self-Containment is scored
- THEN the score is < 30

### Requirement: English Regression Lock (REQ-21.5)

Extending the pattern constants MUST NOT alter English scoring. Every existing EN fixture assertion SHALL keep its exact value.

#### Scenario: Existing EN fixtures keep their exact scores

- GIVEN the English fixtures and assertions (page-definition.html answer 100, page-pronoun-led.html selfContainment 10, page-five-blocks.html pageScore 60.8)
- WHEN the citability suite runs after the pattern extension
- THEN every EN assertion passes unchanged

#### Scenario: English text does not trigger Spanish branches

- GIVEN an EN block "API rate limiting is a technique used to control traffic"
- WHEN Answer Block Quality is scored
- THEN the score equals the pre-change value (English branch only)
