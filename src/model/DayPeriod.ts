import { $t } from '@/stores/storeTranslations'

export class DayPeriod {
  private from: Date | null
  private to: Date | null
  private duration!: number

  constructor(from: Date | null, to: Date | null) {
    this.from = from
    this.to = to
    this.recalculateDuration()
  }

  private recalculateDuration() {
    //Make sure from is before to
    if (this.from && this.to && this.from.getTime() > this.to.getTime()) {
      const t = this.to
      this.to = this.from
      this.from = t
    }
    this.duration = DayPeriod.getDayDifference(this.from, this.to)
  }

  public equals(other: any): boolean {
    return other && DayPeriod.dateToMishFormat(this.from) == DayPeriod.dateToMishFormat(other.from) && DayPeriod.dateToMishFormat(this.to) == DayPeriod.dateToMishFormat(other.to)
  }

  public static getDayDifference(d1: Date | null | undefined, d2: Date | null | undefined) {
    if (d1) d1.setHours(12, 0, 0, 0)
    if (d2) d2.setHours(12, 0, 0, 0)
    if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return -1
    const difference = Math.abs(d1.getTime() - d2.getTime()) + 10000 //+10sec becouse I am scared of leap seconds and that nonsence
    return Math.floor(difference / (1000 * 60 * 60 * 24))
  }

  public static dateToPhobsFormat(date: Date | null): string {
    if (!date) return ''
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  public static dateToMishFormat(date: Date | null | undefined): string {
    if (!date) return ''
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
  }

  public static dateFromMishFormat(date: Date | string | null | undefined): Date | null {
    if (!date) return null
    if (typeof date !== 'string') return date
    const [day, month, year] = date.split('.')
    if (!day || !month || !year) return null
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  public static dateFromPhobsFormat(date: Date | string | null | undefined): Date | null {
    if (!date) return null
    return new Date(date)
  }

  public compareBySimilarityToThis(a: DayPeriod, b: DayPeriod) {
    if (a.equals(b)) return 0
    // Importance: duration > starting date = ending date
    const scoreA = 1.1 * Math.abs(a.getDuration() - this.duration) + DayPeriod.getDayDifference(a.getFrom(), this.from) + DayPeriod.getDayDifference(a.getTo(), this.to)
    const scoreB = 1.1 * Math.abs(b.getDuration() - this.duration) + DayPeriod.getDayDifference(b.getFrom(), this.from) + DayPeriod.getDayDifference(b.getTo(), this.to)
    if (scoreA < scoreB) return -1
    if (scoreA > scoreB) return 1
    //90% should be decided already, the rast is just for completeness' sake
    if (a.getDuration() < b.getDuration()) return -1
    if (a.getDuration() > b.getDuration()) return 1
    if (DayPeriod.dateToMishFormat(a.getFrom()) < DayPeriod.dateToMishFormat(b.getFrom())) return -1
    if (DayPeriod.dateToMishFormat(a.getFrom()) > DayPeriod.dateToMishFormat(b.getFrom())) return 1
    if (DayPeriod.dateToMishFormat(a.getTo()) < DayPeriod.dateToMishFormat(b.getTo())) return -1
    if (DayPeriod.dateToMishFormat(a.getTo()) > DayPeriod.dateToMishFormat(b.getTo())) return 1
    return 0
  }

  public moveWithinPeriod(other: DayPeriod) {
    if (!other.includesDate(this.from)) this.from = other.from
    if (!other.includesDate(this.to)) this.to = other.to
    this.recalculateDuration()
    return this
  }

  public isWithin(period: DayPeriod | null | undefined) {
    if (!period) return false
    return (!period.from || (this.from && this.from.getTime() >= period.from.getTime())) && (!period.to || (this.to && this.to.getTime() <= period.to.getTime()))
  }

  public includesDate(date: Date | null) {
    if (!date) return false
    return (!this.from || this.from.getTime() <= date.getTime()) && (!this.to || this.to.getTime() >= date.getTime())
  }

  public isInfinte() {
    return !this.from || !this.to
  }

  public getFrom(): Date | null {
    return this.from
  }

  public getTo(): Date | null {
    return this.to
  }

  public getDuration(): number {
    return this.duration
  }

  public setFrom(from: Date | null) {
    this.from = from
    this.recalculateDuration()
  }

  public setTo(to: Date | null) {
    this.to = to
    this.recalculateDuration()
  }

  public setFromTo(from: Date | null, to: Date | null) {
    this.from = from
    this.to = to
    this.recalculateDuration()
  }

  public toString() {
    return `${this.from?.toISOString() || null} - ${this.to?.toISOString() || null} Duration: ${this.duration}`
  }

  private dateToString(date: Date | null) {
    return `${date ? date.getDate() : ''}.${date ? date.getMonth() + 1 : ''}.${date ? date.getFullYear() : ''}.`
  }

  public toTitleString() {
    return `${this.dateToString(this.from)}-${this.dateToString(this.to)}${this.duration > 0 ? ` ${this.duration} ${$t("night_plural")}` : ''}`
  }
}
