use radicle::git;
use radicle::identity;

use radicle_types as types;
use radicle_types::traits::issue::Issues;
use radicle_types::traits::issue::IssuesMut;

use crate::error::Error;
use crate::AppState;

#[tauri::command]
pub fn create_issue(
    ctx: tauri::State<AppState>,
    rid: identity::RepoId,
    new: types::cobs::issue::NewIssue,
    opts: types::cobs::CobOptions,
) -> Result<types::cobs::issue::Issue, Error> {
    ctx.create_issue(rid, new, opts).map_err(Error::from)
}

#[tauri::command]
pub fn edit_issue(
    ctx: tauri::State<AppState>,
    rid: identity::RepoId,
    cob_id: git::Oid,
    action: types::cobs::issue::Action,
    opts: types::cobs::CobOptions,
) -> Result<types::cobs::issue::Issue, Error> {
    ctx.edit_issue(rid, cob_id, action, opts)
        .map_err(Error::from)
}

#[tauri::command]
pub(crate) fn list_issues(
    ctx: tauri::State<AppState>,
    rid: identity::RepoId,
    status: Option<types::cobs::query::IssueStatus>,
) -> Result<Vec<types::cobs::issue::Issue>, Error> {
    ctx.list_issues(rid, status).map_err(Error::from)
}

#[tauri::command]
pub(crate) fn issue_by_id(
    ctx: tauri::State<AppState>,
    rid: identity::RepoId,
    id: git::Oid,
) -> Result<Option<types::cobs::issue::Issue>, Error> {
    ctx.issue_by_id(rid, id).map_err(Error::from)
}
