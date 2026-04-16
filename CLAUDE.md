# BrandSync MCP — Claude Code Instructions

## Handoff

**"Handoff" always means calling the `save_handoff` MCP tool.** It never means generating a Word document, a docx file, a markdown file, or any other written artifact.

When any instruction says "save handoff" or "save the handoff":
1. Call the `save_handoff` MCP tool with the correct arguments
2. Do not write any files
3. Do not use the `docx` library or any document generation package
4. Do not run npm install

The `save_handoff` tool writes a JSON state file to `~/.brandsync/handoff/{ticket}.json`. That is the only output.

## BrandSync MCP tools

All pipeline actions go through MCP tools registered by this server:

| What you want to do | Tool to call |
|---|---|
| Save pipeline state | `save_handoff` |
| Load pipeline state | `load_handoff` |
| Query the knowledge graph | `query_graph` |
| Get a component spec | `get_component` |
| List all components | `list_components` |
| Search guidelines | `search_guidelines` |
| Record a decision or gap | `write_corpus_entry` |
| Check attempt history | `get_attempt_history` |

Never substitute a tool call with file generation or script execution.
