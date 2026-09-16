/**
 * Lightweight, storage-backed bridge between the standalone Recruitment
 * Management System and the Integrated Business Management Platform.
 *
 * The two demos are mounted as entirely separate React trees — App.tsx
 * renders exactly one at a time, so neither app's Provider/store exists in
 * memory while the other is on screen. This module is the one narrow,
 * typed channel that carries a hiring outcome across that boundary. It
 * deliberately knows nothing about either demo's Provider or store — only
 * about this one small record shape — so importing it never pulls either
 * demo's page bundle into the other.
 *
 * Records persist in localStorage (not just in-memory) because the required
 * demo flow — hire in Recruitment, switch to the Integrated Platform, see
 * the employee, switch back, see it marked synced — crosses that mount
 * boundary in a single browsing session. A hard page reload is allowed to
 * lose in-app state per the brief; localStorage happens to survive one too,
 * which only makes the demo more robust, not less honest.
 */

export type IntegrationSyncStatus = 'pending' | 'synced'

export interface RecruitmentHireRecord {
  applicantId: string
  applicantName: string
  positionTitle: string
  department: string
  employmentType: 'Full-time' | 'Part-time' | 'Contract'
  email: string
  phone: string
  hiredDate: string
  status: IntegrationSyncStatus
  employeeId?: string
}

const STORAGE_KEY = 'aetex-demo:recruitment-integration-bridge'

function readRecords(): RecruitmentHireRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RecruitmentHireRecord[]) : []
  } catch {
    return []
  }
}

function writeRecords(records: RecruitmentHireRecord[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

/** Reads the current sync record for one applicant, if any hiring sync has been queued. */
export function getHireRecord(applicantId: string): RecruitmentHireRecord | null {
  return readRecords().find((record) => record.applicantId === applicantId) ?? null
}

/** Reads every hire record currently queued or synced — used by the Integrated Platform on mount. */
export function getAllHireRecords(): RecruitmentHireRecord[] {
  return readRecords()
}

export type QueueHireResult =
  | { ok: true; record: RecruitmentHireRecord; alreadyQueued: boolean }
  | { ok: false; error: string }

/**
 * Called from Recruitment when the user confirms "Add to Integrated
 * Platform". Idempotent per applicantId — a repeat call for the same
 * applicant returns the existing record instead of queuing a duplicate.
 */
export function queueHireForIntegration(input: Omit<RecruitmentHireRecord, 'status' | 'employeeId'>): QueueHireResult {
  const records = readRecords()
  const existing = records.find((record) => record.applicantId === input.applicantId)
  if (existing) return { ok: true, record: existing, alreadyQueued: true }

  const record: RecruitmentHireRecord = { ...input, status: 'pending' }
  const saved = writeRecords([...records, record])
  if (!saved) return { ok: false, error: "Couldn't reach the integration bridge. Try again." }
  return { ok: true, record, alreadyQueued: false }
}

/**
 * Called from the Integrated Platform on every mount. The Employee list
 * itself doesn't persist across a mount — no backend, and the two demos are
 * separate React trees that fully unmount one another — only this bridge's
 * small record does. So this walks every hire record (queued or already
 * synced) and asks the caller to make sure a matching Employee exists in
 * the *current* session, then keeps the record's status/employee ID in
 * sync with whatever the caller returns.
 *
 * `ensureEmployee` must be idempotent within a single mount (e.g. via a
 * ref-tracked set of applicant IDs already handled) so React StrictMode's
 * double effect invocation in development can't create a duplicate.
 */
export function reconcileHires(ensureEmployee: (record: RecruitmentHireRecord) => string): void {
  const records = readRecords()
  if (records.length === 0) return

  let changed = false
  const next = records.map((record) => {
    const employeeId = ensureEmployee(record)
    if (record.status === 'synced' && record.employeeId === employeeId) return record
    changed = true
    return { ...record, status: 'synced' as const, employeeId }
  })
  if (changed) writeRecords(next)
}
