import axios from "axios";

async function callApi() {
    return axios.get(
        "https://m2m.vinaphone.com.vn/msimapi/getListSimByAccount",
        {
            auth: {
                username: "atcom_test",
                password: "5fe8a65534906455f671510814e30432",
            },
            params: {
                page: -1,
                size: -1,
            },
        }
    );
}

function callSimDetail(msisdn) {
    return axios.get("https://m2m.vinaphone.com.vn/msimapi/getSimInfo", {
        headers: {
            Authorization:
                "Basic YXRjb21fdGVzdDo1ZmU4YTY1NTM0OTA2NDU1ZjY3MTUxMDgxNGUzMDQzMg==",
        },
        params: {
            msisdn: msisdn,
        },
    });
}

function getSim() {
    axios.get("");
}

async function main() {
    let res1 = await callApi();
    let i = 0;
    let sims = res1.data.listSim;
    for (let index in sims) {
        setTimeout(() => {
            console.log((Math.round(Math.random() * 10) + 1) * 1000);
            callSimDetail(sims[index].msisdn)
                .then((res) => {
                    console.log(res.data);
                    i++;
                })
                .catch((error) => console.log(error));
        }, Math.floor((Math.round(Math.random() * 10) + 1) * 1000));
    }
    console.log(i);
    console.log("END ================================");
}

main();
