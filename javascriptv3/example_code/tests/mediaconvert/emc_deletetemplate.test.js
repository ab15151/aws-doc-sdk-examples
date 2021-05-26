const mockDeleteJobTemp = jest.fn();
jest.mock(
  "@aws-sdk/client-mediaconvert/commands/DeleteJobTemplateCommand",
  () => ({
    MediaConvert: function MediaConvert() {
      this.DeleteJobTemplateCommand = mockDeleteJobTemp;
    },
  })
);
import { params, run } from "../../mediaconvert/src/emc_deletetemplate";

test("has to mock mediaconvert#deletejobtemplate", async (done) => {
  await run();
  expect(mockDeleteJobTemp).toHaveBeenCalled;
  done();
});
