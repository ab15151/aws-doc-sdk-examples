describe("S3#getBucketAcl", () => {
    
  const mockBucketAcl = jest.fn();
  jest.mock("@aws-sdk/client-s3/commands/GetBucketAclCommand", () => ({
    S3: function S3() {
      this.GetBucketAclCommand = mockBucketAcl;
    },
  }));

  const { run } = require("../src/s3_getbucketacl");

  //test function
  test("has to mock S3#getBucketAcl", async (done) => {
    await run();
    expect(mockBucketAcl).toHaveBeenCalled;
    done();
  });
});