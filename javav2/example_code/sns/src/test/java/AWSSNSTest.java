/*
   Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
   SPDX-License-Identifier: Apache-2.0
*/
import com.example.sns.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.assertFalse;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.Message;
import java.io.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

@TestInstance(TestInstance.Lifecycle.PER_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AWSSNSTest {
    public static final String DASHES = new String(new char[80]).replace("\0", "-");
    private static  SnsClient snsClient;
    private static String topicName = "";
    private static String topicArn = ""; // This value is dynamically set.
    private static String subArn = ""; // This value is dynamically set.
    private static String attributeName= "";
    private static String attributeValue = "";
    private static String  email="";
    private static String lambdaarn="";
    private static String phone="";
    private static String message="";

    @BeforeAll
    public static void setUp() throws IOException {
        snsClient = SnsClient.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .build();

        try (InputStream input = AWSSNSTest.class.getClassLoader().getResourceAsStream("config.properties")) {

            Properties prop = new Properties();

            if (input == null) {
                System.out.println("Sorry, unable to find config.properties");
                return;
            }
            //load a properties file from class path, inside static method
            prop.load(input);
            topicName = prop.getProperty("topicName");
            attributeName= prop.getProperty("attributeName");
            attributeValue = prop.getProperty("attributeValue");
            email= prop.getProperty("email");
            lambdaarn = prop.getProperty("lambdaarn");
            phone = prop.getProperty("phone");
            message = prop.getProperty("message");

        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    @Test
    @Tag("IntegrationTest")
    @Order(1)
    public void createTopicTest() {
        topicArn = CreateTopic.createSNSTopic(snsClient, topicName);
        System.out.println("Test 1 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(2)
    public void listTopicsTest() {
        ListTopics.listSNSTopics(snsClient);
        System.out.println("Test 2 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(3)
    public void setTopicAttributesTest() {
        SetTopicAttributes.setTopAttr(snsClient, attributeName, topicArn, attributeValue );
        System.out.println("Test 3 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(4)
    public void getTopicAttributesTest() {
        GetTopicAttributes.getSNSTopicAttributes(snsClient, topicArn);
        System.out.println("Test 4 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(5)
    public void subscribeEmailTest() {
        SubscribeEmail.subEmail(snsClient, topicArn, email);
        System.out.println("Test 5 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(6)
    public void subscribeLambdaTest() {
        subArn = SubscribeLambda.subLambda(snsClient, topicArn, lambdaarn);
        assertFalse(subArn.isEmpty());
        System.out.println("Test 6 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(7)
    public void useMessageFilterPolicyTest() {
        UseMessageFilterPolicy.usePolicy(snsClient, subArn);
        System.out.println("Test 7 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(8)
    public void addTagsTest() {
        AddTags.addTopicTags(snsClient,topicArn );
        System.out.println("Test 8 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(9)
    public void listTagsTest() {
        ListTags.listTopicTags(snsClient,topicArn);
        System.out.println("Test 9 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(10)
    public void deleteTagTest() {
        DeleteTag.removeTag(snsClient,topicArn, "Environment");
        System.out.println("Test 10 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(11)
    public void unsubscribeTest() {
        Unsubscribe.unSub(snsClient, subArn);
        System.out.println("Test 11 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(12)
    public void publishTopicTest() {
        PublishTopic.pubTopic(snsClient, message, topicArn);
        System.out.println("Test 12 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(13)
    public void subscribeTextSMSTest() {
        SubscribeTextSMS.subTextSNS(snsClient, topicArn, phone);
        System.out.println("Test 13 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(14)
    public void publishTextSMSTest() {
        PublishTextSMS.pubTextSMS(snsClient, message, phone);
        System.out.println("Test 14 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(15)
    public void listSubscriptionsTest() {
        ListSubscriptions.listSNSSubscriptions(snsClient);
        System.out.println("Test 15 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(16)
    public void DeleteTopic() {
        DeleteTopic.deleteSNSTopic(snsClient, topicArn);
        System.out.println("Test 16 passed");
    }

    @Test
    @Tag("IntegrationTest")
    @Order(17)
    public void TestWorkflowFIFO() throws InterruptedException {
        SnsClient snsClient = SnsClient.builder()
            .region(Region.US_EAST_1)
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
            .build();

        SqsClient sqsClient = SqsClient.builder()
            .region(Region.US_EAST_1)
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
            .build();

        String accountId = "814548047983" ;
        String duplication = "n";
        String topicName;

        String topicArn;
        String sqsQueueName;
        String sqsQueueUrl;
        String sqsQueueArn ;
        String subscriptionArn;
        boolean selectFIFO = false;

        String message ;
        List<Message> messageList;
        List<String> filterList = new ArrayList<>();
        String msgAttValue = "";

        System.out.println(DASHES);
        System.out.println("Welcome to messaging with topics and queues.");
        System.out.println(DASHES);

        System.out.println(DASHES);
        selectFIFO = true;
        duplication = "n";
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("2. Create a  topic.");
        topicName = "topic1000";
        topicName = topicName+".fifo";
        topicArn = SNSWorkflow.createFIFO(snsClient, topicName);
        System.out.println("The ARN of the FIFO topic is "+topicArn);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("3. Create an SQS queue.");
        sqsQueueName = "queue1000";
        sqsQueueName = sqsQueueName + ".fifo";
        sqsQueueUrl = SNSWorkflow.createQueue(sqsClient, sqsQueueName, selectFIFO);
        System.out.println("The Queue URL is "+sqsQueueUrl);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("4. Get the SQS queue ARN attribute.");
        sqsQueueArn = SNSWorkflow.getSQSQueueAttrs(sqsClient, sqsQueueUrl);
        System.out.println("The ARN of the new queue is "+sqsQueueArn);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("5. Attach an IAM policy to the queue.");

        // Define the policy to use.
        String policy = "{\n" +
            "     \"Statement\": [\n" +
            "     {\n" +
            "         \"Effect\": \"Allow\",\n" +
            "                 \"Principal\": {\n" +
            "             \"Service\": \"sns.amazonaws.com\"\n" +
            "         },\n" +
            "         \"Action\": \"sqs:SendMessage\",\n" +
            "                 \"Resource\": \"arn:aws:sqs:us-east-1:"+accountId+":"+sqsQueueName+"\",\n" +
            "                 \"Condition\": {\n" +
            "             \"ArnEquals\": {\n" +
            "                 \"aws:SourceArn\": \"arn:aws:sns:us-east-1:"+accountId+":"+topicName+"\"\n" +
            "             }\n" +
            "         }\n" +
            "     }\n" +
            "     ]\n" +
            " }";

        SNSWorkflow.setQueueAttr(sqsClient, sqsQueueUrl, policy);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("6. Subscribe to the SQS queue.");
        subscriptionArn = SNSWorkflow.subQueue(snsClient, topicArn, sqsQueueArn, filterList);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("7. Publish a message to the topic.");
        message = "Hello there";
        SNSWorkflow.pubMessageFIFO(snsClient, message, topicArn, msgAttValue, duplication);
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        messageList = SNSWorkflow.receiveMessages(sqsClient, sqsQueueUrl, msgAttValue);
        for (Message mes :messageList) {
            System.out.println("Message Id: " +mes.messageId());
            System.out.println("Full Message: " +mes.body());
        }
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        SNSWorkflow.deleteMessages(sqsClient, sqsQueueUrl, messageList);
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        SNSWorkflow.unSub(snsClient, subscriptionArn);
        SNSWorkflow.deleteSQSQueue(sqsClient, sqsQueueName);
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        SNSWorkflow.deleteSNSTopic(snsClient, topicArn);

        System.out.println(DASHES);
        System.out.println("The SNS/SQS Workflow has completed successfully.");
        System.out.println(DASHES);
    }

    @Test
    @Tag("IntegrationTest")
    @Order(18)
    public void TestWorkflowNonFIFO() throws InterruptedException {
        SnsClient snsClient = SnsClient.builder()
            .region(Region.US_EAST_1)
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
            .build();

        SqsClient sqsClient = SqsClient.builder()
            .region(Region.US_EAST_1)
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
            .build();

        String accountId = "814548047983" ;
        String useFIFO;
        String duplication = "n";
        String topicName;

        String topicArn;
        String sqsQueueName;
        String sqsQueueUrl;
        String sqsQueueArn ;
        String subscriptionArn;
        boolean selectFIFO = false;

        String message ;
        List<Message> messageList;
        List<String> filterList = new ArrayList<>();
        String msgAttValue = "";

        System.out.println(DASHES);
        System.out.println("Welcome to messaging with topics and queues.");
        System.out.println(DASHES);

        System.out.println(DASHES);
        duplication = "n";
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("2. Create a topic.");
        topicName = "topic1003";
        topicArn = SNSWorkflow.createSNSTopic(snsClient, topicName);
        System.out.println("The ARN of the FIFO topic is "+topicArn);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("3. Create an SQS queue.");
        sqsQueueName = "queue1003";
        sqsQueueUrl = SNSWorkflow.createQueue(sqsClient, sqsQueueName, selectFIFO);
        System.out.println("The Queue URL is "+sqsQueueUrl);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("4. Get the SQS queue ARN attribute.");
        sqsQueueArn = SNSWorkflow.getSQSQueueAttrs(sqsClient, sqsQueueUrl);
        System.out.println("The ARN of the new queue is "+sqsQueueArn);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("5. Attach an IAM policy to the queue.");

        // Define the policy to use.
        String policy = "{\n" +
            "     \"Statement\": [\n" +
            "     {\n" +
            "         \"Effect\": \"Allow\",\n" +
            "                 \"Principal\": {\n" +
            "             \"Service\": \"sns.amazonaws.com\"\n" +
            "         },\n" +
            "         \"Action\": \"sqs:SendMessage\",\n" +
            "                 \"Resource\": \"arn:aws:sqs:us-east-1:"+accountId+":"+sqsQueueName+"\",\n" +
            "                 \"Condition\": {\n" +
            "             \"ArnEquals\": {\n" +
            "                 \"aws:SourceArn\": \"arn:aws:sns:us-east-1:"+accountId+":"+topicName+"\"\n" +
            "             }\n" +
            "         }\n" +
            "     }\n" +
            "     ]\n" +
            " }";

        SNSWorkflow.setQueueAttr(sqsClient, sqsQueueUrl, policy);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("6. Subscribe to the SQS queue.");
        subscriptionArn = SNSWorkflow.subQueue(snsClient, topicArn, sqsQueueArn, filterList);
        System.out.println(DASHES);

        System.out.println(DASHES);
        System.out.println("7. Publish a message to the topic.");
        message = "Hello there";
        SNSWorkflow.pubMessage(snsClient, message, topicArn);
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        messageList = SNSWorkflow.receiveMessages(sqsClient, sqsQueueUrl, msgAttValue);
        for (Message mes :messageList) {
            System.out.println("Message Id: " +mes.messageId());
            System.out.println("Full Message: " +mes.body());
        }
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        SNSWorkflow.deleteMessages(sqsClient, sqsQueueUrl, messageList);
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        SNSWorkflow.unSub(snsClient, subscriptionArn);
        SNSWorkflow.deleteSQSQueue(sqsClient, sqsQueueName);
        System.out.println(DASHES);

        System.out.println(DASHES);
        TimeUnit.SECONDS.sleep(2);
        SNSWorkflow.deleteSNSTopic(snsClient, topicArn);

        System.out.println(DASHES);
        System.out.println("The SNS/SQS workflow has completed successfully.");
        System.out.println(DASHES);
    }

}