<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Red Home architecture
- Appwrite Account owns sessions; roles come only from the user's Appwrite labels (admin, agent, none = user) and the client never writes a role, so users cannot pick their own role.
- All Appwrite access goes through src/services modules with a lazily created client; SSR stays safe and missing config fails closed.
- User reads always filter by userId; admin-created rows grant read only to the target user; ledger and audit services expose no update/delete.
- Public property pages share a bundled illustrative catalog; Appwrite table/bucket permissions, not route guards, are the security boundary.
