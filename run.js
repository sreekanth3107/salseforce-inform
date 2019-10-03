require('dotenv').config();

const argv = require('yargs').argv;
var lambda = require('./src/lambda');

if (!argv.fn) {
    console.log(`No lambda function name provided as "--fn=function-name" argument to "node run.js" script.`);
    process.exit();
}

var functionNames = [
    "sf-request-access-code-helper",
    "sf_request_query_helper_sf_customer_id",
    "sf_request_query_helper_aws_customer_identifier",
    "sf-request-q-access-code-send-email",
    "sf-request-q-access-code-send-email-wo-message",
    "sf-request-q-access-code-send-email-wo-customer-id",
    "sf-request-q-access-code-send-email-wo-subject",
    "sf-request-q-access-code-unsubscribe"
]

switch (argv.fn) {
    case "sf-request-access-code-helper":
        lambda.sf_request_access_code_helper();
        break;
    case "sf-request-query-helper-sf-customer-id":
        lambda.sf_request_query_helper_sf_customer_id();
        break;
    case "sf-request-query-helper-aws-customer-identifier":
        lambda.sf_request_query_helper_aws_customer_identifier();
        break;
    case "sf-request-query-helper-cloud-customer-identifier":
        lambda.sf_request_query_helper_cloud_customer_identifier();
        break;    
    case "sf-request-q-access-code-send-email":
        lambda.sf_request_q_access_code_send_email();
        break;
    case "sf-request-q-access-code-send-email-wo-message":
        lambda.sf_request_q_access_code_send_email_wo_message();
        break;
    case "sf-request-q-access-code-send-email-wo-customer-id":
        lambda.sf_request_q_access_code_send_email_wo_customer_id();
        break;
    case "sf-request-q-access-code-send-email-wo-subject":
        lambda.sf_request_q_access_code_send_email_wo_subject();
        break;
    case "sf-request-q-access-code-unsubscribe":
        lambda.sf_request_q_access_code_unsubscribe();
        break;
    default:
        console.log(`Invalid lambda function name provided as "--fn=function-name" argument to "node run.js" script.`);
        console.log(`Available functions are:\n${functionNames.toString().split(",").join("\n")}`)
        break;
}