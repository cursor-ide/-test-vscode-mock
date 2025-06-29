/**
 * Type guards for VS Code API types
 */

import { Position, Range, Selection, Location } from './position';
import { Uri } from '../Uri';

export function isPosition(value: any): value is Position {
  return value instanceof Position || (
    value &&
    typeof value.line === 'number' &&
    typeof value.character === 'number'
  );
}

export function isRange(value: any): value is Range {
  return value instanceof Range || (
    value &&
    isPosition(value.start) &&
    isPosition(value.end)
  );
}

export function isSelection(value: any): value is Selection {
  return value instanceof Selection || (
    value &&
    isPosition(value.anchor) &&
    isPosition(value.active)
  );
}

export function isLocation(value: any): value is Location {
  return value instanceof Location || (
    value &&
    value.uri instanceof Uri &&
    isRange(value.range)
  );
}

export function isUri(value: any): value is Uri {
  return value instanceof Uri || (
    value &&
    typeof value.scheme === 'string' &&
    typeof value.path === 'string'
  );
}