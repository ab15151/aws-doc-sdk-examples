import { run, params } from "../../iam/src/iam_listaccesskeys";
import { iamClient } from "../../iam/src/libs/iamClient.js";

jest.mock("../../iam/src/libs/iamClient.js");

describe("@aws-sdk/client-iam mock", () => {
  it("should successfully mock IAM client", async () => {
    iamClient.send.mockResolvedValue({ isMock: true });
    const response = await run(params);
    expect(response.isMock).toEqual(true);
  });
});
