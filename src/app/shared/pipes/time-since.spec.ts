import { TimeSincePipe } from './time-since.pipe';
import * as moment from 'moment';

describe('TimeSincePipe', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(moment('2021-05-15T12:00:00').toDate());
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  const pipe = new TimeSincePipe();

  it('5 mins in the future', () => {
    expect(pipe.transform(moment('2021-05-15T12:05:00')).humanize()).toBe('5 minutes');
  });

  it('1 day in the past', () => {
    expect(pipe.transform(moment('2021-05-14T12:00:00')).humanize()).toBe('a day');
  });

  it('a few hours ago', () => {
    expect(pipe.transform(moment('2021-05-15T10:00:00')).humanize()).toBe('2 hours');
  });

  it('no time passsed', () => {
    expect(pipe.transform(moment('2021-05-15T12:00:00')).humanize()).toBe('a few seconds');
  });

  it('a few hours ago (unit: days)', () => {
    expect(pipe.transform(moment('2021-05-15T10:00:00'), "InDays").humanize()).toBe('a few seconds');
  });

  it('no time passsed (unit: days)', () => {
    expect(pipe.transform(moment('2021-05-15T12:00:00'), "InDays").humanize()).toBe('a few seconds');
  });

  it('around day in the future (unit: days)', () => {
    expect(pipe.transform(moment('2021-05-16T13:13:13'), "InDays").humanize()).toBe('a day');
  });

  it('around day in the past (unit: days)', () => {
    expect(pipe.transform(moment('2021-05-14T08:08:08'), "InDays").humanize()).toBe('a day');
  });
});
