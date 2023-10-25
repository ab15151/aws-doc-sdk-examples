/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

use aws_sdk_s3 as s3;
use mockall::{automock, predicate::eq};

use s3::operation::list_objects_v2::{ListObjectsV2Error, ListObjectsV2Output};

// snippet-start:[testing.rust.wrapper]
#[cfg(test)]
pub use MockS3Impl as S3;
#[cfg(not(test))]
pub use S3Impl as S3;

pub struct S3Impl {
    inner: s3::Client,
}

#[cfg_attr(test, automock)]
impl S3Impl {
    pub fn new(inner: s3::Client) -> Self {
        Self { inner }
    }

    pub async fn list_objects(
        &self,
        bucket: &str,
        prefix: &str,
        continuation_token: Option<String>,
    ) -> Result<ListObjectsV2Output, s3::error::SdkError<ListObjectsV2Error>> {
        self.inner
            .list_objects_v2()
            .bucket(bucket)
            .prefix(prefix)
            .set_continuation_token(continuation_token)
            .send()
            .await
    }
}

pub async fn determine_prefix_file_size(
    // Now we take a reference to our trait object instead of the S3 client
    // s3_list: ListObjectsService,
    s3_list: S3,
    bucket: &str,
    prefix: &str,
) -> Result<usize, s3::Error> {
    let mut next_token: Option<String> = None;
    let mut total_size_bytes = 0;
    loop {
        let result = s3_list
            .list_objects(bucket, prefix, next_token.take())
            .await?;

        // Add up the file sizes we got back
        for object in result.contents() {
            total_size_bytes += object.size() as usize;
        }

        // Handle pagination, and break the loop if there are no more pages
        next_token = result.next_continuation_token.clone();
        if next_token.is_none() {
            break;
        }
    }
    Ok(total_size_bytes)
}
// snippet-end:[testing.rust.wrapper]

// snippet-start:[testing.rust.wrapper-tests]
// This time, we add a helper function for making pages
fn make_page(sizes: &[i64]) -> Vec<s3::types::Object> {
    sizes
        .iter()
        .map(|size| s3::types::Object::builder().size(*size).build())
        .collect()
}

#[tokio::test]
async fn test_single_page() {
    let mut mock = MockS3Impl::default();
    mock.expect_list_objects()
        .with(eq("some-bucket"), eq("some-prefix"), eq(None))
        .return_once(|_, _, _| {
            Ok(ListObjectsV2Output::builder()
                .set_contents(Some(make_page(&[5, 2])))
                .build())
        });

    // Run the code we want to test with it
    let size = determine_prefix_file_size(mock, "some-bucket", "some-prefix")
        .await
        .unwrap();

    // Verify we got the correct total size back
    assert_eq!(7, size);
}

#[tokio::test]
async fn test_multiple_pages() {
    // Create the Mock instance with two pages of objects now
    let mut mock = MockS3Impl::default();
    mock.expect_list_objects()
        .with(eq("some-bucket"), eq("some-prefix"), eq(None))
        .return_once(|_, _, _| {
            Ok(ListObjectsV2Output::builder()
                .set_contents(Some(make_page(&[5, 2])))
                .set_next_continuation_token(Some("next".to_string()))
                .build())
        });
    mock.expect_list_objects()
        .with(
            eq("some-bucket"),
            eq("some-prefix"),
            eq(Some("next".to_string())),
        )
        .return_once(|_, _, _| {
            Ok(ListObjectsV2Output::builder()
                .set_contents(Some(make_page(&[3, 9])))
                .build())
        });

    // Run the code we want to test with it
    let size = determine_prefix_file_size(mock, "some-bucket", "some-prefix")
        .await
        .unwrap();

    assert_eq!(19, size);
}
// snippet-end:[testing.rust.wrapper-tests]
