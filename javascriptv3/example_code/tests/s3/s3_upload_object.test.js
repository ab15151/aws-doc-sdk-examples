import { run, uploadParams } from "../../s3/src/s3_upload_object";
import { s3Client } from "../../s3/src/libs/s3Client.js";

jest.mock("../../s3/src/libs/s3Client.js");

describe("@aws-sdk/client-s3 mock", () => {
  it("should successfully mock s3 client", async () => {
    s3Client.send.mockResolvedValue({ isMock: true });
    const response = await run(uploadParams);
    expect(response.isMock).toEqual(true);
  });
});
