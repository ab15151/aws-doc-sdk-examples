import { run, params } from "../../redshift/src/redshift-modify-cluster";
import { redshiftClient } from "../../redshift/src/libs/redshiftClient.js";

jest.mock("../../redshift/src/libs/redshiftClient.js");

describe("@aws-sdk/client-redshift mock", () => {
  it("should successfully mock redshift client", async () => {
    redshiftClient.send.mockResolvedValue({ isMock: true });
    const response = await run(params);
    expect(response.isMock).toEqual(true);
  });
});
