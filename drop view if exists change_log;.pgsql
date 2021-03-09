drop view if exists change_log;
CREATE VIEW change_log (ref_id, ref_rev, ref_kind, ref_change_kind, ref_modified, ref_modified_by, ref_action, element_id, element_revision, element_kind, name) AS  SELECT ca.id AS ref_id,
    ca.rev AS ref_rev,
    'CONCEPT'::text AS ref_kind,
    ca.change_kind AS ref_change_kind,
    COALESCE(ca.modified, ref.modified) AS ref_modified,
    COALESCE(ca.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    ca.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(ca.name, 'Deleted'::character varying) AS name
   FROM (audit.concept_aud ca
     LEFT JOIN revinfo ref ON ((ref.id = ca.rev)))
UNION
 SELECT cc.id AS ref_id,
    cc.rev AS ref_rev,
    'CONTROL_CONSTRUCT'::text AS ref_kind,
    cc.change_kind AS ref_change_kind,
    COALESCE(cc.modified, ref.modified) AS ref_modified,
    COALESCE(cc.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    cc.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(cc.name, 'Deleted'::character varying) AS name
   FROM (audit.control_construct_aud cc
     LEFT JOIN revinfo ref ON ((ref.id = cc.rev)))
UNION
 SELECT ai.id AS ref_id,
    ai.rev AS ref_rev,
    'INSTRUMENT'::text AS ref_kind,
    ai.change_kind AS ref_change_kind,
    COALESCE(ai.modified, ref.modified) AS ref_modified,
    COALESCE(ai.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    ai.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(ai.name, 'Deleted'::character varying) AS name
   FROM (audit.instrument_aud ai
     LEFT JOIN revinfo ref ON ((ref.id = ai.rev)))
UNION
 SELECT qi.id AS ref_id,
    qi.rev AS ref_rev,
    'QUESTION_ITEM'::text AS ref_kind,
    qi.change_kind AS ref_change_kind,
    ref.modified AS ref_modified,
    ref.modified_by_id AS ref_modified_by,
    qi.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(qi.name, 'Deleted'::character varying) AS name
   FROM (audit.question_item_aud qi
     LEFT JOIN revinfo ref ON ((ref.id = qi.rev)))
UNION
 SELECT rd.id AS ref_id,
    rd.rev AS ref_rev,
    'RESPONSEDOMAIN'::text AS ref_kind,
    rd.change_kind AS ref_change_kind,
    COALESCE(rd.modified, ref.modified) AS ref_modified,
    COALESCE(rd.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    rd.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(rd.name, 'Deleted'::character varying) AS name
   FROM (audit.responsedomain_aud rd
     LEFT JOIN revinfo ref ON ((ref.id = rd.rev)))
UNION
 SELECT sa.id AS ref_id,
    sa.rev AS ref_rev,
    'STUDY'::text AS ref_kind,
    sa.change_kind AS ref_change_kind,
    COALESCE(sa.modified, ref.modified) AS ref_modified,
    COALESCE(sa.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    sa.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(sa.name, 'Deleted'::character varying) AS name
   FROM (audit.study_aud sa
     LEFT JOIN revinfo ref ON ((ref.id = sa.rev)))
UNION
 SELECT asp.id AS ref_id,
    asp.rev AS ref_rev,
    'SURVEY_PROGRAM'::text AS ref_kind,
    asp.change_kind AS ref_change_kind,
    COALESCE(asp.modified, ref.modified) AS ref_modified,
    COALESCE(asp.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    asp.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(asp.name, 'Deleted'::character varying) AS name
   FROM (audit.survey_program_aud asp
     LEFT JOIN revinfo ref ON ((ref.id = asp.rev)))
UNION
 SELECT atg.id AS ref_id,
    atg.rev AS ref_rev,
    'TOPIC_GROUP'::text AS ref_kind,
    atg.change_kind AS ref_change_kind,
    COALESCE(atg.modified, ref.modified) AS ref_modified,
    COALESCE(atg.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    atg.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(atg.name, 'Deleted'::character varying) AS name
   FROM (audit.topic_group_aud atg
     LEFT JOIN revinfo ref ON ((ref.id = atg.rev)))
UNION
 SELECT ap.id AS ref_id,
    ap.rev AS ref_rev,
    'PUBLICATION'::text AS ref_kind,
    ap.change_kind AS ref_change_kind,
    COALESCE(ap.modified, ref.modified) AS ref_modified,
    COALESCE(ap.modified_by_id, ref.modified_by_id) AS ref_modified_by,
    ap.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    NULL::character varying AS element_kind,
    COALESCE(ap.name, 'Deleted'::character varying) AS name
   FROM (audit.publication_aud ap
     LEFT JOIN revinfo ref ON ((ref.id = ap.rev)))
UNION
 SELECT COALESCE(cqi.element_id, cqi.concept_id) AS ref_id,
    cqi.rev AS ref_rev,
    COALESCE(cqi.element_kind, ('CONCEPT'::text)::character varying) AS ref_kind,
    'modified_HIERARCHY_RELATION'::text AS ref_change_kind,
    ref.modified AS ref_modified,
    ref.modified_by_id AS ref_modified_by,
    cqi.revtype AS ref_action,
    cqi.element_id,
    cqi.element_revision,
    cqi.element_kind,
    COALESCE(cqi.name, 'Deleted'::character varying) AS name
   FROM (audit.concept_question_item_aud cqi
     LEFT JOIN revinfo ref ON ((ref.id = cqi.rev)))
UNION
 SELECT COALESCE(tgqi.element_id, tgqi.topicgroup_id) AS ref_id,
    tgqi.rev AS ref_rev,
    COALESCE(tgqi.element_kind, ('TOPIC_GROUP'::text)::character varying) AS ref_kind,
    'modified_HIERARCHY_RELATION'::text AS ref_change_kind,
    ref.modified AS ref_modified,
    ref.modified_by_id AS ref_modified_by,
    tgqi.revtype AS ref_action,
    tgqi.element_id,
    tgqi.element_revision,
    tgqi.element_kind,
    COALESCE(tgqi.element_name, 'Deleted'::character varying) AS name
   FROM (audit.topic_group_question_item_aud tgqi
     LEFT JOIN revinfo ref ON ((ref.id = tgqi.rev)))
UNION
 SELECT ccom.owner_id AS ref_id,
    ccom.rev AS ref_rev,
    'OTHER_MATERIAL'::text AS ref_kind,
    NULL::character varying AS ref_change_kind,
    ref.modified AS ref_modified,
    ref.modified_by_id AS ref_modified_by,
    ccom.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    'OTHER_MATERIAL'::text AS element_kind,
    ccom.original_name AS name
   FROM (audit.control_construct_other_material_aud ccom
     LEFT JOIN revinfo ref ON ((ref.id = ccom.rev)))
UNION
 SELECT tgom.owner_id AS ref_id,
    tgom.rev AS ref_rev,
    'TOPIC_GROUP'::text AS ref_kind,
    NULL::character varying AS ref_change_kind,
    ref.modified AS ref_modified,
    ref.modified_by_id AS ref_modified_by,
    tgom.revtype AS ref_action,
    NULL::uuid AS element_id,
    NULL::integer AS element_revision,
    'OTHER_MATERIAL'::text AS element_kind,
    tgom.original_name AS name
   FROM (audit.topic_group_other_material_aud tgom
     LEFT JOIN revinfo ref ON ((ref.id = tgom.rev)));

drop view if exists project_archived;
CREATE VIEW project_archived (id, path, name, is_archived, parent_id) AS  SELECT concept.id,
    '/concept'::text AS path,
    concept.name,
    concept.is_archived,
    COALESCE(concept.topicgroup_id, concept.concept_id) AS parent_id
   FROM concept
UNION
 SELECT topic_group.id,
    '/module'::text AS path,
    topic_group.name,
    topic_group.is_archived,
    topic_group.study_id AS parent_id
   FROM topic_group
UNION
 SELECT study.id,
    '/study'::text AS path,
    study.name,
    study.is_archived,
    study.survey_id AS parent_id
   FROM study
UNION
 SELECT survey_program.id,
    '/survey'::text AS path,
    survey_program.name,
    survey_program.is_archived,
    NULL::uuid AS parent_id
   FROM survey_program;

drop view if exists project_archived_hierarchy;

CREATE VIEW project_archived_hierarchy (id, path, name, is_archived, ancestors) AS  WITH RECURSIVE tree AS (
         SELECT project_archived.id,
            project_archived.path,
            project_archived.name,
            project_archived.is_archived,
            ARRAY[]::uuid[] AS ancestors
           FROM project_archived
          WHERE (project_archived.parent_id IS NULL)
        UNION ALL
         SELECT project_archived.id,
            project_archived.path AS kind,
            project_archived.name,
            project_archived.is_archived,
            (tree_1.ancestors || project_archived.parent_id)
           FROM project_archived,
            tree tree_1
          WHERE (project_archived.parent_id = tree_1.id)
        )
 SELECT tree.id,
    tree.path,
    tree.name,
    tree.is_archived,
    tree.ancestors
   FROM tree;

drop view if exists uar;

CREATE VIEW uar (id, email, username, name, authority) AS  SELECT ua.id,
    ua.email,
    ua.username,
    a.name,
    a.authority
   FROM ((user_account ua
     LEFT JOIN user_account_authority au ON ((au.user_id = ua.id)))
     LEFT JOIN authority a ON ((au.authority_id = a.id)))
  WHERE ua.is_enabled;

drop view if exists uuidpath;

CREATE VIEW uuidpath (id, path, name, modified_by_id) AS  SELECT c.id,
    '/categories'::text AS path,
    c.name,
    c.modified_by_id
   FROM category c
  WHERE ((c.category_kind)::text = 'CATEGORY'::text)
UNION
 SELECT c.id,
    '/missing'::text AS path,
    c.name,
    c.modified_by_id
   FROM category c
  WHERE ((c.category_kind)::text = 'MISSING_GROUP'::text)
UNION
 SELECT ins.id,
    '/instructions'::text AS path,
    ins.name,
    ins.modified_by_id
   FROM instruction ins
UNION
 SELECT cc.id,
    '/conditions'::text AS path,
    cc.name,
    cc.modified_by_id
   FROM control_construct cc
  WHERE ((cc.control_construct_kind)::text = 'CONDITION_CONSTRUCT'::text)
UNION
 SELECT cc.id,
    '/statements'::text AS path,
    cc.name,
    cc.modified_by_id
   FROM control_construct cc
  WHERE ((cc.control_construct_kind)::text = 'STATEMENT_CONSTRUCT'::text)
UNION
 SELECT cc.id,
    '/questions'::text AS path,
    cc.name,
    cc.modified_by_id
   FROM control_construct cc
  WHERE ((cc.control_construct_kind)::text = 'QUESTION_CONSTRUCT'::text)
UNION
 SELECT cc.id,
    '/sequences'::text AS path,
    cc.name,
    cc.modified_by_id
   FROM control_construct cc
  WHERE ((cc.control_construct_kind)::text = 'SEQUENCE_CONSTRUCT'::text)
UNION
 SELECT instrument.id,
    '/instruments'::text AS path,
    instrument.name,
    instrument.modified_by_id
   FROM instrument
UNION
 SELECT publication.id,
    '/publications'::text AS path,
    publication.name,
    publication.modified_by_id
   FROM publication
UNION
 SELECT question_item.id,
    '/questionitems'::text AS path,
    question_item.name,
    question_item.modified_by_id
   FROM question_item
UNION
 SELECT responsedomain.id,
    '/responsedomains'::text AS path,
    responsedomain.name,
    responsedomain.modified_by_id
   FROM responsedomain
UNION
 SELECT concept.id,
    '/concept'::text AS path,
    concept.name,
    concept.modified_by_id
   FROM concept
UNION
 SELECT topic_group.id,
    '/module'::text AS path,
    topic_group.name,
    topic_group.modified_by_id
   FROM topic_group
UNION
 SELECT study.id,
    '/study'::text AS path,
    study.name,
    study.modified_by_id
   FROM study
UNION
 SELECT survey_program.id,
    '/survey'::text AS path,
    survey_program.name,
    survey_program.modified_by_id
   FROM survey_program;
