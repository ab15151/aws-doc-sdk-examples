//snippet-sourcedescription:[ListClusters.java demonstrates how to list clusters.]
//snippet-keyword:[AWS SDK for Java v2]
//snippet-keyword:[Code Sample]
//snippet-keyword:[Amazon EMR]
//snippet-sourcetype:[full-example]
//snippet-sourcedate:[07/19/2021]
//snippet-sourceauthor:[scmacdon AWS]
/*
   Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
   SPDX-License-Identifier: Apache-2.0
*/

package aws.example.emr;

// snippet-start:[emr.java2.list_clusters.import]
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.emr.EmrClient;
import software.amazon.awssdk.services.emr.model.*;
import java.util.List;
// snippet-end:[emr.java2.list_clusters.import]

/*
 *   Ensure that you have setup your development environment, including your credentials.
 *   For information, see this documentation topic:
 *
 *   https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/get-started.html
 *
 */
public class ListClusters {

    public static void main(String[] args){

        Region region = Region.US_WEST_2;
        EmrClient emrClient = EmrClient.builder()
                .region(region)
                .build();

        listAllClusters(emrClient);
        emrClient.close();
    }

    // snippet-start:[emr.java2.list_clusters.main]
    public static void listAllClusters(EmrClient emrClient) {

        try {

            ListClustersRequest clustersRequest = ListClustersRequest.builder()
                    .build();

            ListClustersResponse response = emrClient.listClusters(clustersRequest);
           List<ClusterSummary> clusters = response.clusters();

            for (ClusterSummary cluster: clusters) {
                System.out.println("The cluster name is : "+cluster.name());
                System.out.println("The cluster ARN is : "+cluster.clusterArn());
            }

        } catch(EmrException e){
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }
    // snippet-end:[emr.java2.list_clusters.main]
}
