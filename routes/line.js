var axios = require("axios");
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  "Authorization": "Bearer <CHANNEL-ACCESS-TOKEN>"
};


axios({
    url: LINE_MESSAGING_API,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: "samnateiei",
      messages: [
        {
          type: "template",
          altText: "This is a confirm template",
          template: {
            type: "confirm",
            text: "Are you sure?",
            actions: [
              {
                type: "message",
                label: "Yes",
                text: "yes"
              },
              {
                type: "message",
                label: "No",
                text: "no"
              }
            ]
          }
        }
      ]
    })

})

// async function sentToLine() {

//   const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
//   const LINE_HEADER = {
//     "Content-Type": "application/json",
//     Authorization: "Bearer <CHANNEL-ACCESS-TOKEN>",
//   };

//   const body = JSON.stringify({
//     to: "samnateiei",
//     messages: [
//       {
//         type: "template",
//         altText: "This is a confirm template",
//         template: {
//           type: "confirm",
//           text: "Are you sure?",
//           actions: [
//             {
//               type: "message",
//               label: "Yes",
//               text: "yes",
//             },
//             {
//               type: "message",
//               label: "No",
//               text: "no",
//             },
//           ],
//         },
//       },
//     ],
//   });

//   try {
//     await axios.post(LINE_MESSAGING_API, body, { headers: LINE_HEADER })
//   } catch (error) {
//     console.log(error)
//   }
// }