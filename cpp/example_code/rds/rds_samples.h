/*
   Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
   SPDX-License-Identifier: Apache-2.0
*/

#pragma once
#ifndef RDS_EXAMPLES_RDS_SAMPLES_H
#define RDS_EXAMPLES_RDS_SAMPLES_H

namespace AwsDoc {
    namespace RDS {
        //! Routine which creates a Relational Database Service (Amazon RDS)
        //! instance and creates a snapshot of the instance.
        /*!
         \sa gettingStartedWithDBInstances()
         \param clientConfiguration: AWS client configuration.
         \return bool: Successful completion.
         */
        bool gettingStartedWithDBInstances(
                const Aws::Client::ClientConfiguration &clientConfig);

    } // RDS
} // AwsDoc

#endif //RDS_EXAMPLES_RDS_SAMPLES_H
