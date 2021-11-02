// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//snippet-sourcedescription:[Get a secret in the AWS Secrets Manager ]
//snippet-keyword:[secretsmanager]
//snippet-sourcetype:[full-example]
//snippet-sourcedate:[10/27/2021]
//snippet-sourceauthor:[gangwere]
package common

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

//snippet-start:[secretsmanager.go-v2.GetSecret]

func GetSecret(config aws.Config, arn string) (string, error) {
	conn := secretsmanager.NewFromConfig(config)

	result, err := conn.GetSecretValue(context.TODO(), &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(arn),
	})

	if err != nil {
		return "", err
	}

	return *result.SecretString, err
}

//snippet-end:[secretsmanager.go-v2.GetSecret]
