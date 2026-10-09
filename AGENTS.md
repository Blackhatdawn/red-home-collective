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
- Firebase Auth owns sessions and Firestore stores roles in a separate roles collection; signup creates only user access to prevent client-selected privilege escalation.
- Firebase services initialize lazily from public VITE configuration and role routes fail closed; this keeps SSR safe and unauthorized content hidden.
- Public property pages share a bundled illustrative catalog and reusable presentation modules; live publishing remains separate from the browsing preview.
- Firestore security rules enforce role changes and owner-only favorites independently of route guards; client navigation is not a security boundary.
