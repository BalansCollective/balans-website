/**
 * Patch Applier - Applies parsed patches to file content
 * Extracted from: https://github.com/cline/cline (Apache 2.0 License)
 */

import { DiffError, type Patch, PatchActionType, type PatchChunk } from './types';
import { preserveEscaping } from './string-utils';

export interface ApplyResult {
	path: string;
	newContent?: string; // undefined if deleted
	deleted?: boolean;
}

/**
 * Apply a parsed patch to generate new file contents
 */
export function applyPatch(patch: Patch, originalFiles: Record<string, string>): ApplyResult[] {
	const results: ApplyResult[] = [];

	for (const [path, action] of Object.entries(patch.actions)) {
		switch (action.type) {
			case PatchActionType.ADD:
				if (!action.newFile) {
					throw new DiffError(`ADD action for ${path} has no content`);
				}
				results.push({
					path,
					newContent: action.newFile,
				});
				break;

			case PatchActionType.DELETE:
				results.push({
					path,
					deleted: true,
				});
				break;

			case PatchActionType.UPDATE:
				const originalContent = originalFiles[path];
				if (!originalContent) {
					throw new DiffError(`UPDATE action for ${path} but no original file provided`);
				}
				const newContent = applyChunks(originalContent, action.chunks, path);
				results.push({
					path: action.movePath || path,
					newContent,
				});
				if (action.movePath) {
					// Original file is deleted when moving
					results.push({
						path,
						deleted: true,
					});
				}
				break;
		}
	}

	return results;
}

/**
 * Applies patch chunks to the given content.
 * @param content The original file content.
 * @param chunks The patch chunks to apply.
 * @param path The file path (for error messages).
 * @param tryPreserveEscaping Whether to attempt preserving escaping style.
 * @returns The modified content after applying the chunks.
 */
function applyChunks(content: string, chunks: PatchChunk[], path: string, tryPreserveEscaping = false): string {
	if (chunks.length === 0) {
		return content;
	}

	const endsWithNewline = content.endsWith("\n");
	const lines = content.split("\n");
	const result: string[] = [];
	let currentIndex = 0;

	for (const chunk of chunks) {
		if (chunk.origIndex > lines.length) {
			throw new DiffError(`${path}: chunk.origIndex ${chunk.origIndex} > lines.length ${lines.length}`);
		}
		if (currentIndex > chunk.origIndex) {
			throw new DiffError(`${path}: currentIndex ${currentIndex} > chunk.origIndex ${chunk.origIndex}`);
		}

		// Copy lines before the chunk
		result.push(...lines.slice(currentIndex, chunk.origIndex));

		// Get the original lines being replaced to detect escaping style
		const originalLines = lines.slice(chunk.origIndex, chunk.origIndex + chunk.delLines.length);
		const originalText = originalLines.join("\n");

		// Add inserted lines, preserving escaping style from original
		const insertedLines = chunk.insLines.map((line) => {
			// Only preserve escaping if we have original text to compare against
			if (tryPreserveEscaping && originalText) {
				return preserveEscaping(originalText, line);
			}
			return line;
		});
		result.push(...insertedLines);

		// Skip deleted lines
		currentIndex = chunk.origIndex + chunk.delLines.length;
	}

	// Copy remaining lines
	result.push(...lines.slice(currentIndex));
	const joined = result.join("\n");

	return endsWithNewline && !joined.endsWith("\n") ? `${joined}\n` : joined;
}

