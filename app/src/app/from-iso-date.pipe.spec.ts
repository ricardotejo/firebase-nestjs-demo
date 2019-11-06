import { FromIsoDatePipe } from './from-iso-date.pipe';

describe('FromIsoDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FromIsoDatePipe();
    expect(pipe).toBeTruthy();
  });
});
