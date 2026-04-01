/**
 * Merge MCP `servers` maps without replacing existing keys: new server ids are added;
 * when the same id exists, merge **missing** keys only (existing values win on conflict).
 */
export function mergeMcpServerMaps(
  dest: Record<string, unknown>,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...dest };
  for (const [id, inc] of Object.entries(incoming)) {
    if (!inc || typeof inc !== "object" || Array.isArray(inc)) {
      continue;
    }
    const incObj = inc as Record<string, unknown>;
    const cur = out[id];
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      out[id] = mergeMissingKeysDeep(cur as Record<string, unknown>, incObj);
    } else if (!(id in out)) {
      out[id] = inc;
    }
  }
  return out;
}

function mergeMissingKeysDeep(
  existing: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...existing };
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in out)) {
      out[k] = v;
    } else if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === "object" &&
      !Array.isArray(out[k])
    ) {
      out[k] = mergeMissingKeysDeep(out[k] as Record<string, unknown>, v as Record<string, unknown>);
    }
  }
  return out;
}
