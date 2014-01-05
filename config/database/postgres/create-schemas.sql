CREATE TABLE COLLABORATOR (
  id            SERIAL       NOT NULL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  creation_date DATE
);

CREATE TABLE "user" (
  id                  SERIAL       NOT NULL PRIMARY KEY,
  authentication_type TEXT         NOT NULL,
  authenticator_uri   VARCHAR(255),
  colaborator_id      INTEGER      NOT NULL,
  firstname           VARCHAR(255) NOT NULL,
  lastname            VARCHAR(255) NOT NULL,
  password            VARCHAR(255) NOT NULL,
  activation_code     BIGINT       NOT NULL,
  activation_date     DATE,
  allow_send_email    TEXT         NOT NULL DEFAULT 0,
  locale              VARCHAR(5),
  FOREIGN KEY (colaborator_id) REFERENCES COLLABORATOR (id) ON DELETE CASCADE ON UPDATE NO ACTION
);


CREATE TABLE MINDMAP (
  id             SERIAL       NOT NULL PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  description    VARCHAR(255) NOT NULL,
  xml            BYTEA        NOT NULL,
  public         BOOL         NOT NULL DEFAULT FALSE,
  creation_date  TIMESTAMP,
  edition_date   TIMESTAMP,
  creator_id     INTEGER      NOT NULL,
  tags           VARCHAR(1014),
  last_editor_id INTEGER      NOT NULL --,
--FOREIGN KEY(creator_id) REFERENCES "USER"(colaborator_id) ON DELETE CASCADE ON UPDATE NO ACTION
);


CREATE TABLE MINDMAP_HISTORY
(id            SERIAL  NOT NULL PRIMARY KEY,
 xml           BYTEA   NOT NULL,
 mindmap_id    INTEGER NOT NULL,
 creation_date TIMESTAMP,
 editor_id     INTEGER NOT NULL,
  FOREIGN KEY (mindmap_id) REFERENCES MINDMAP (id) ON DELETE CASCADE ON UPDATE NO ACTION
);


CREATE TABLE COLLABORATION_PROPERTIES (
  id                 SERIAL NOT NULL PRIMARY KEY,
  starred            BOOL   NOT NULL DEFAULT FALSE,
  mindmap_properties VARCHAR(512)
);

CREATE TABLE COLLABORATION (
  id             SERIAL  NOT NULL PRIMARY KEY,
  colaborator_id INTEGER NOT NULL,
  properties_id  INTEGER NOT NULL,
  mindmap_id     INTEGER NOT NULL,
  role_id        INTEGER NOT NULL,
  FOREIGN KEY (colaborator_id) REFERENCES COLLABORATOR (id),
  FOREIGN KEY (mindmap_id) REFERENCES MINDMAP (id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (properties_id) REFERENCES COLLABORATION_PROPERTIES (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE TAG (
  id      SERIAL       NOT NULL PRIMARY KEY,
  name    VARCHAR(255) NOT NULL,
  user_id INTEGER      NOT NULL --,
--FOREIGN KEY(user_id) REFERENCES "USER"(colaborator_id) ON DELETE CASCADE ON UPDATE NO ACTION
);


CREATE TABLE ACCESS_AUDITORY (
  id         SERIAL  NOT NULL PRIMARY KEY,
  login_date DATE,
  user_id    INTEGER NOT NULL
);


COMMIT;