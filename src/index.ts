// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL.js'
import nlp from 'compromise'

declare const danger: DangerDSLType
// Declare function message(message: string): void
declare function warn(message: string): void
declare function fail(message: string): void
declare function markdown(message: string): void

/**
 * Validate PR titles
 *
 * Checks for subject length, capitalisation, trailing punctuation,
 * and imperative mood.
 */
export function checkTitle() {
	let { title } = danger.github.pr
	/** @todo Ignore "tag" prefixes. */
	let isImperative = Boolean(nlp(title).verbs().isImperative().text())

	if (!isImperative) {
		fail('PR titles should use the imperative mood.')
		markdown(`
*Imperative mood* just means “spoken or written as if giving a command
or instruction”.

💡 **Tip:** A properly formed Git commit subject line should always be
able to complete the following sentence:

> If applied, this commit will…
		`)
	}

	if (50 <= title.length && title.length <= 72) {
		warn('Great PR titles are 50 characters or fewer.')
	}

	if (72 < title.length) {
		fail(
			'PR titles must be less than 72 characters to avoid being truncated.'
		)
	}

	if (50 <= title.length) {
		markdown(`
💡 **Tip:** If you’re having a hard time summarizing, you might be
committing too many changes at once.
		`)
	}
}
