import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import findRoot from 'find-root';

import { ComponentID } from '@teambit/component-id';

type Primitive = string | number | boolean | undefined | null;
type Json = {
  [key: string]: Json | Primitive;
};

export function fileToBitId(filepath: string) {
  const root = findRoot(filepath);
  if (!root) return undefined;

  const id = bitIdFromPkgPath(join(root, 'package.json'));
  return id;
}

function bitIdFromPkgPath(pkgPath: string): string | undefined {
  const pkg = parsePkgJson(pkgPath);
  const compId = pkg?.componentId;
  if (!compId) return undefined;

  try {
    const parsed = ComponentID.fromObject(compId);
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function parsePkgJson(pkgPath: string): Json | undefined {
  if (!existsSync(pkgPath)) return undefined;
  try {
    const content = readFileSync(pkgPath, 'utf-8');
    const json = JSON.parse(content) as Json;

    return json;
  } catch {
    return undefined;
  }
}