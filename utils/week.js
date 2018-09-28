class WeekObj {
  weeks;
  _start;
  _end;
  _title;
  constructor(weeks) {
    this.weeks = weeks;
  }
  get start() {
    this._start = this.weeks[0];
    return this._start;
  }
  get end() {
    this._end = this.weeks[this.weeks.length - 1];
    return this._end;
  }
  get title() {
    const start = new Date(this.start);
    const end = new Date(this.end);
    this._title = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}~${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
    return this._title;
  }
}
export default WeekObj;