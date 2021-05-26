import { run, params } from "../../ses/src/ses_deleteidentity";
import { sesClient } from "../../ses/src/libs/sesClient.js";

jest.mock("../../ses/src/libs/sesClient.js");

describe("@aws-sdk/client-ses mock", () => {
  it("should successfully mock SES client", async () => {
    sesClient.send.mockResolvedValue({ isMock: true });
    const response = await run(params);
    expect(response.isMock).toEqual(true);
  });
});
