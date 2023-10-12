# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to use the AWS SDK for Python (Boto3) to manage and invoke AWS HealthImaging
functions.
"""

import logging
from botocore.exceptions import ClientError
import time
import datetime
import boto3
import random
import gzip
import json

logger = logging.getLogger(__name__)


class MedicalImagingWrapper:
    def __init__(self, health_imaging_client):
        self.health_imaging_client = health_imaging_client

    # snippet-start:[python.example_code.medical-imaging.CreateDatastore]
    def create_datastore(self, name):
        """
        Create a data store.

        :param name: The name of the data store to create.
        :return: The data store ID.
        """
        try:
            data_store = self.health_imaging_client.create_datastore(datastoreName=name)
        except ClientError as err:
            logger.error(
                "Couldn't create data store %s. Here's why: %s: %s", name, err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return data_store['datastoreId']

    # snippet-end:[python.example_code.medical-imaging.CreateDatastore]

    # snippet-start:[python.example_code.medical-imaging.GetDatastore]
    def get_datastore_properties(self, datastore_id):
        """
        Get the properties of a data store.

        :param datastore_id: The ID of the data store.
        :return: The data store properties.
        """
        try:
            data_store = self.health_imaging_client.get_datastore(datastoreId=datastore_id)
        except ClientError as err:
            logger.error(
                "Couldn't get data store %s. Here's why: %s: %s", id, err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return data_store['datastoreProperties']

    # snippet-end:[python.example_code.medical-imaging.GetDatastore]

    # snippet-start:[python.example_code.medical-imaging.ListDatastores]
    def list_datastores(self):
        """
        List the data stores.

        :return: The list of data stores.
        """
        try:
            paginator = self.health_imaging_client.get_paginator('list_datastores')
            page_iterator = paginator.paginate()
            datastore_summaries = []
            for page in page_iterator:
                datastore_summaries.extend(page['datastoreSummaries'])
        except ClientError as err:
            logger.error(
                "Couldn't list data stores. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return datastore_summaries

    # snippet-end:[python.example_code.medical-imaging.ListDatastores]

    # snippet-start:[python.example_code.medical-imaging.DeleteDatastore]
    def delete_datastore(self, datastore_id):
        """
        Delete a data store.

        :param datastore_id: The ID of the data store.
        """
        try:
            self.health_imaging_client.delete_datastore(datastoreId=datastore_id)
        except ClientError as err:
            logger.error(
                "Couldn't delete data store %s. Here's why: %s: %s", datastore_id, err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise

    # snippet-end:[python.example_code.medical-imaging.DeleteDatastore]

    # snippet-start:[python.example_code.medical-imaging.StartDICOMImportJob]
    def start_dicom_import_job(self, job_name, datastore_id, role_arn, input_s3_uri, output_s3_uri):
        """
        Start a DICOM import job.

        :param job_name: The name of the job.
        :param datastore_id: The ID of the data store.
        :param role_arn: The Amazon Resource Name (ARN) of the role to use for the job.
        :param input_s3_uri: The S3 bucket input prefix path containing the DICOM files.
        :param output_s3_uri: The S3 bucket output prefix path for the result.
        :return: The job ID.
        """
        try:
            job = self.health_imaging_client.start_dicom_import_job(
                jobName=job_name,
                datastoreId=datastore_id,
                dataAccessRoleArn=role_arn,
                inputS3Uri=input_s3_uri,
                outputS3Uri=output_s3_uri,
            )
        except ClientError as err:
            logger.error(
                "Couldn't start DICOM import job. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return job['jobId']

    # snippet-end:[python.example_code.medical-imaging.StartDICOMImportJob]

    # snippet-start:[python.example_code.medical-imaging.GetDICOMImportJob]
    def get_dicom_import_job(self, datastore_id, job_id):
        """
        Get the properties of a DICOM import job.

        :param datastore_id: The ID of the data store.
        :param job_id: The ID of the job.
        :return: The job properties.
        """
        try:
            job = self.health_imaging_client.get_dicom_import_job(jobId=job_id, datastoreId=datastore_id)
        except ClientError as err:
            logger.error(
                "Couldn't get DICOM import job. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return job['jobProperties']

    # snippet-end:[python.example_code.medical-imaging.GetDICOMImportJob]

    # snippet-start:[python.example_code.medical-imaging.ListDICOMImportJobs]
    def list_dicom_import_jobs(self, datastore_id):
        """
        List the DICOM import jobs.

        :param datastore_id: The ID of the data store.
        :return: The list of jobs.
        """
        try:
            paginator = self.health_imaging_client.get_paginator('list_dicom_import_jobs')
            page_iterator = paginator.paginate(datastoreId=datastore_id)
            job_summaries = []
            for page in page_iterator:
                job_summaries.extend(page['jobSummaries'])
        except ClientError as err:
            logger.error(
                "Couldn't list DICOM import jobs. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return job_summaries

    # snippet-end:[python.example_code.medical-imaging.ListDICOMImportJobs]

    # snippet-start:[python.example_code.medical-imaging.SearchImageSets]
    def search_image_sets(self, datastore_id, search_filter):
        """
        Search for image sets.

        :param datastore_id: The ID of the data store.
        :param search_filter: The search filter.
            For example: {"filters" : [{ "operator": "EQUAL", "values": [{"DICOMPatientId": "3524578"}]}]}.
        :return: The list of image sets.
        """
        try:
            paginator = self.health_imaging_client.get_paginator('search_image_sets')
            page_iterator = paginator.paginate(datastoreId=datastore_id, searchCriteria=search_filter)
            metadata_summaries = []
            for page in page_iterator:
                metadata_summaries.extend(page['imageSetsMetadataSummaries'])
        except ClientError as err:
            logger.error(
                "Couldn't search image sets. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return metadata_summaries

    # snippet-end:[python.example_code.medical-imaging.SearchImageSets]

    # snippet-start:[python.example_code.medical-imaging.GetImageSet]
    def get_image_set(self, datastore_id, image_set_id, version_id):
        """
        Get the properties of an image set.

        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :param version_id: The version of the image set.
        :return: The image set properties.
        """
        try:
            image_set = self.health_imaging_client.get_image_set(imageSetId=image_set_id, datastoreId=datastore_id,
                                                                 versionId=version_id)
        except ClientError as err:
            logger.error(
                "Couldn't get image set. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return image_set

    # snippet-end:[python.example_code.medical-imaging.GetImageSet]

    # snippet-start:[python.example_code.medical-imaging.GetImageSetMetadata]
    def get_image_set_metadata(self, metadata_file, datastore_id, image_set_id, version_id=None):
        """
        Get the metadata of an image set.

        :param metadata_file: The file to store the JSON gzipped metadata.
        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :param version_id: The version of the image set.
        """
        try:
            if version_id:
                image_set_metadata = self.health_imaging_client.get_image_set_metadata(imageSetId=image_set_id,
                                                                                       datastoreId=datastore_id,
                                                                                       versionId=version_id)
            else:
                image_set_metadata = self.health_imaging_client.get_image_set_metadata(imageSetId=image_set_id,
                                                                                       datastoreId=datastore_id)
            print(image_set_metadata)
            with open(metadata_file, 'wb') as f:
                for chunk in image_set_metadata['imageSetMetadataBlob'].iter_chunks():
                    if chunk:
                        f.write(chunk)

        except ClientError as err:
            logger.error(
                "Couldn't get image metadata. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise

    # snippet-end:[python.example_code.medical-imaging.GetImageSetMetadata]

    # snippet-start:[python.example_code.medical-imaging.GetImageFrame]
    def get_pixel_data(self, file_path_to_write, datastore_id, image_set_id, image_frame_id):
        """
        Get an image frame's pixel data.

        :param file_path_to_write: The path to write the image frame's HTJ2K encoded pixel data.
        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :param image_frame_id: The ID of the image frame.
        """
        try:
            image_frame = self.health_imaging_client.get_image_frame(datastoreId=datastore_id,
                                                                     imageSetId=image_set_id,
                                                                     imageFrameInformation={
                                                                         "imageFrameId": image_frame_id})
            with open(file_path_to_write, 'wb') as f:
                for chunk in image_frame['imageFrameBlob'].iter_chunks():
                    if chunk:
                        f.write(chunk)
        except ClientError as err:
            logger.error(
                "Couldn't get image frame. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise

    # snippet-end:[python.example_code.medical-imaging.GetImageFrame]

    # snippet-start:[python.example_code.medical-imaging.ListImageSetVersions]
    def list_image_set_versions(self, datastore_id, image_set_id):
        """
        List the image set versions.

        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :return: The list of image set versions.
        """
        try:
            paginator = self.health_imaging_client.get_paginator('list_image_set_versions')
            page_iterator = paginator.paginate(imageSetId=image_set_id,
                                               datastoreId=datastore_id)
            image_set_properties_list = []
            for page in page_iterator:
                image_set_properties_list.extend(page['imageSetPropertiesList'])
        except ClientError as err:
            logger.error(
                "Couldn't list image set versions. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return image_set_properties_list

    # snippet-end:[python.example_code.medical-imaging.ListImageSetVersions]

    # snippet-start:[python.example_code.medical-imaging.UpdateImageSetMetadata]
    def update_image_set_metadata(self, datastore_id, image_set_id, version_id, metadata):
        """
        Update the metadata of an image set.

        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :param version_id: The ID of the image set version.
        :param metadata: The image set metadata as a dictionary.
            For example {"DICOMUpdates": {"updatableAttributes":
            "{\"SchemaVersion\":1.1,\"Patient\":{\"DICOM\":{\"PatientName\":\"Garcia^Gloria\"}}}"}}
        :return: The updated image set metadata.
        """
        try:
            updated_metadata = self.health_imaging_client.update_image_set_metadata(
                imageSetId=image_set_id, datastoreId=datastore_id, latestVersionId=version_id,
                updateImageSetMetadataUpdates=metadata)
        except ClientError as err:
            logger.error(
                "Couldn't update image set metadata. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return updated_metadata

    # snippet-end:[python.example_code.medical-imaging.UpdateImageSetMetadata]

    # snippet-start:[python.example_code.medical-imaging.CopyImageSet]
    def copy_image_set(self, datastore_id, image_set_id, version_id, destination_image_set_id=None,
                       destination_version_id=None):
        """
        Copy an image set.

        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :param version_id: The ID of the image set version.
        :param destination_image_set_id: The ID of the optional destination image set.
        :param destination_version_id: The ID of the optional destination image set version.
        :return: The copied image set ID.
        """
        try:
            copy_image_set_information = {'sourceImageSet': {'latestVersionId': version_id}}
            if destination_image_set_id and destination_version_id:
                copy_image_set_information["destinationImageSet"] = {"imageSetId": destination_image_set_id,
                                                                     "latestVersionId": destination_version_id}
            copy_results = self.health_imaging_client.copy_image_set(
                datastoreId=datastore_id,
                sourceImageSetId=image_set_id,
                copyImageSetInformation=copy_image_set_information)
        except ClientError as err:
            logger.error(
                "Couldn't copy image set. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return copy_results['destinationImageSetProperties']['imageSetId']

    # snippet-end:[python.example_code.medical-imaging.CopyImageSet]

    # snippet-start:[python.example_code.medical-imaging.DeleteImageSet]
    def delete_image_set(self, datastore_id, image_set_id):
        """
        Delete an image set.

        :param datastore_id: The ID of the data store.
        :param image_set_id: The ID of the image set.
        :return: The delete results.
        """
        try:
            delete_results = self.health_imaging_client.delete_image_set(
                imageSetId=image_set_id, datastoreId=datastore_id)
        except ClientError as err:
            logger.error(
                "Couldn't delete image set. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return delete_results

    # snippet-end:[python.example_code.medical-imaging.DeleteImageSet]

    # snippet-start:[python.example_code.medical-imaging.TagResource]
    def tag_resource(self, resource_arn, tags):
        """
        Tag a resource.

        :param resource_arn: The ARN of the resource.
        :param tags: The tags to apply.
        """
        try:
            self.health_imaging_client.tag_resource(resourceArn=resource_arn, tags=tags)
        except ClientError as err:
            logger.error(
                "Couldn't tag resource. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise

    # snippet-end:[python.example_code.medical-imaging.TagResource]

    # snippet-start:[python.example_code.medical-imaging.UntagResource]
    def untag_resource(self, resource_arn, tag_keys):
        """
        Untag a resource.

        :param resource_arn: The ARN of the resource.
        :param tag_keys: The tag keys to remove.
        """
        try:
            self.health_imaging_client.untag_resource(resourceArn=resource_arn, tagKeys=tag_keys)
        except ClientError as err:
            logger.error(
                "Couldn't untag resource. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise

    # snippet-end:[python.example_code.medical-imaging.UntagResource]

    # snippet-start:[python.example_code.medical-imaging.ListTagsForResource]
    def list_tags_for_resource(self, resource_arn):
        """
        List the tags for a resource.

        :param resource_arn: The ARN of the resource.
        :return: The list of tags.
        """
        try:
            tags = self.health_imaging_client.list_tags_for_resource(resourceArn=resource_arn)
        except ClientError as err:
            logger.error(
                "Couldn't list tags for resource. Here's why: %s: %s", err.response['Error']['Code'],
                err.response['Error']['Message'])
            raise
        else:
            return tags['tags']

    # snippet-end:[python.example_code.medical-imaging.ListTagsForResource]

    def usage_demo(self, source_s3_uri, dest_s3_uri, data_access_role_arn):
        data_store_name = f"python_usage_demo_data_store_{random.randint(0, 200000)}"

        data_store_id = self.create_datastore(data_store_name)
        print(f"Data store created with id : {data_store_id}")

        while True:
            time.sleep(1)
            datastore_properties = self.get_datastore_properties(data_store_id)
            datastore_status = datastore_properties['datastoreStatus']
            print(f'data store status: "{datastore_status}"')
            if datastore_status == "ACTIVE":
                break
            elif datastore_status == "CREATE_FAILED":
                raise Exception("Create datastore job failed")

        datastores = self.list_datastores()
        print(f"datastores : {datastores}")

        job_name = "python_usage_demo_job"
        job_id = self.start_dicom_import_job(job_name, data_store_id,
                                             data_access_role_arn,
                                             source_s3_uri, dest_s3_uri)
        print(f"Started import job with id: {job_id}")

        while True:
            time.sleep(1)
            job = self.get_dicom_import_job(data_store_id, job_id)
            job_status = job['jobStatus']
            print(f'Status of import job : "{job_status}"')
            if job_status == "COMPLETED":
                break
            elif job_status == "FAILED":
                raise Exception("DICOM import job failed")

        import_jobs = self.list_dicom_import_jobs(data_store_id)
        print(import_jobs)
        for job in import_jobs:
            print(job)

        filter = {
            "filters": [{
                "values": [{"createdAt": datetime.datetime(2021, 8, 4, 14, 49, 54, 429000)},
                           {"createdAt": datetime.datetime.now() + datetime.timedelta(days=1)}],
                "operator": "BETWEEN"
            }]
        }

        image_sets = self.search_image_sets(data_store_id, filter)
        for image_set in image_sets:
            print(image_set)

        image_set_id = image_sets[0]['imageSetId']
        version_id = image_sets[0]['version']
        returned_image_set = self.get_image_set(data_store_id, image_set_id, str(version_id))
        print(returned_image_set)

        image_metadata_file_name = "metadata.json.gzip"
        self.get_image_set_metadata(image_metadata_file_name, data_store_id,
                                    image_set_id)
        image_frame_id = ""
        with gzip.open(image_metadata_file_name, 'rb') as f_in:
            data = json.load(f_in)
            series = data['Study']['Series']
            for value in series.values():
                for instance in value['Instances'].values():
                    image_frame_id = instance['ImageFrames'][0]['ID']

        if image_frame_id == "":
            raise Exception("Image frame id is empty")

        image_file_name = "image_frame.jph"
        returned_image_frame = self.get_pixel_data(image_file_name, data_store_id,
                                                   image_set_id,
                                                   image_frame_id)

        returned_versions = self.list_image_set_versions(data_store_id, image_set_id)
        for version in returned_versions:
            print(version)

        if False:
            result = self.copy_image_set(data_store_id, "6ec347bff13a36fe32939e41a1e5e158", "3")
            print(result)

            result = self.delete_image_set(data_store_id, "230e7c272021733c4c2768fc527ffd33")
            print(result)

            resource_arn = "arn:aws:medical-imaging:us-east-1:123502194722:datastore/728f13a131f748bf8d87a55d5ef6c5af"
            self.tag_resource(resource_arn,
                              {"TagType": "datastore"})
            result = self.list_tags_for_resource(resource_arn)
            print(result)

            self.untag_resource(resource_arn,
                                ["TagType"])

            result = self.list_tags_for_resource(resource_arn)
            print(result)


        for image_set in image_sets:
           self.delete_image_set(data_store_id, image_set['imageSetId'])

        self.delete_datastore(data_store_id)
        print(f"Data store deleted with id : {data_store_id}")

if __name__ == '__main__':
    source_s3_uri = "s3://upload-22-dicom-387/input/CRStudy/"
    dest_s3_uri = "s3://upload-22-dicom-387/input/MRStudy/"
    data_access_role_arn = "arn:aws:iam::123502194722:role/dicom_import"

    client = boto3.client('medical-imaging', region_name='us-west-2')
    medical_imaging_wrapper = MedicalImagingWrapper(client)

    medical_imaging_wrapper.usage_demo(source_s3_uri,dest_s3_uri, data_access_role_arn)