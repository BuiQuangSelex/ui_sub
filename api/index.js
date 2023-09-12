// curl -X 'GET' \
//   'http://localhost:8080/services/subscriptionservice/api/driver/subscription-data/current' \
//   -H 'accept: */*' \
//   -H 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1OTgzIiwic3ViIjoiZGV2MyIsImV4cCI6MTY5MzAyNTE4M30.3HtNYFoINKQD0zUbkQJH_Vc5VlOYt8MgV065A4D9bM89QDjbqiyzC-vIcbB3k_OG_nLegV6u0yVMsptkAYrn0w'

let body = document.getElementById("main");
let subscriptionTitle = document.querySelector(".subscription-title");
let tableCycleSub = document.getElementById("table-cycle-sub");
let vehicleInput = document.getElementById("vehicle-input");
let btnCall = document.getElementById("btn-input-vehicle");
let authentication =
    "Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2MDAwIiwic3ViIjoiZGV2MyIsImV4cCI6MTY5NDU5ODg3Mn0.zVoOttB-RrAB9i9aHgybOKdFvyboMiYXHe4Jugowy0GuB264wowrLR6DUH0YTPePyKHw_Hc0JG9bU7iyiOY3oQ";

var getSubCurrentLocal = (vehicle) => {
    return fetch(
        `http://localhost:8080/services/subscriptionservice/api/v2/driver/subscription-data/vehicle/${vehicle}/current`,
        {
            headers: {
                accept: "*/*",
                Authorization: authentication,
            },
            method: "GET",
        }
    );
};

let getPackageDataInfo = fetch(
    "https://api.dev.selex.vn/services/subscriptionservice/api/package-data/53",
    {
        headers: {
            accept: "*/*",
            Authorization: authentication,
        },
        method: "GET",
    }
);

(async () => {
    try {
        let res = await getPackageDataInfo;
        let data = await res.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();

const callSub = () => {
    let vehicleSerial = vehicleInput.value;
    tableCycleSub.innerHTML = "";
    getSubCurrentLocal(vehicleSerial)
        .then(async (res) => {
            let cycCurrentIndex = 0;

            try {
                var sub = await res.json();
                console.info(sub);

                document.querySelector(".subscription-title").textContent =
                    sub.name;

                document.querySelector(".username").textContent = sub.user;
                document.querySelector(".vehicle").textContent =
                    sub.vehicleSerial;

                document.querySelector(".sub-id").textContent = sub.id;

                let cycleBilling = sub.cycleBillings;
                cycleBilling.sort((a, b) =>
                    a.startDate > b.startDate ? 0 : -1
                );
                let cycBillingCurrent = sub.cycleBillingCurrent;
                cycCurrentIndex = cycleBilling.findIndex((c) =>
                    cycBillingCurrent ? c.id == cycBillingCurrent.id : false
                );

                let totalCost = 0,
                    totalDeposited = 0;

                cycleBilling.forEach((billing, index) => {
                    totalCost += billing.totalCost;
                    totalDeposited += billing.deposited;

                    let row = document.createElement("tr");
                    let activeClass =
                        cycBillingCurrent && billing.id == cycBillingCurrent.id
                            ? "billing-active bg-active"
                            : "";

                    let rowContent = `
                            <th scope="row">${billing.id}</th>
                            <td>${billing.startDate}</td>
                            <td>${billing.endDate}</td>
                            <td>${billing.swapCount}</td>
                            <td>${
                                billing.id > cycBillingCurrent.id
                                    ? "not active"
                                    : !billing.startOdo
                                    ? "null"
                                    : Math.round(
                                          ((sub.lastOdo - billing.startOdo) /
                                              1000) *
                                              100
                                      ) / 100
                            }</td>
                            <td>${
                                billing.swapLimit > 0
                                    ? billing.swapLimit
                                    : "not limit"
                            }</td>
                            <td>${
                                billing.id > cycBillingCurrent.id
                                    ? "not active"
                                    : billing.maxOdo > 0
                                    ? Math.round(
                                          ((billing.maxOdo - billing.startOdo) /
                                              1000) *
                                              100
                                      ) / 100
                                    : "not limit"
                            }</td>
                            <td>${billing.swapExceed}</td>
                            <td>${
                                Math.round(
                                    (billing.distanceExceed / 1000) * 100
                                ) / 100
                            }</td>
                            <td>${billing.priceOfPackage}</td>
                            <td>${billing.discount}</td>
                            <td>${billing.whyDiscount}</td>
                            <td>${billing.totalCost}</td>
                            <td>${billing.deposited}</td>
                            <td>${billing.debt}</td>`;

                    row.innerHTML = rowContent;
                    if (activeClass) row.classList.add("table-success");
                    tableCycleSub.appendChild(row);
                });
                let rowLast = document.createElement("tr");
                let rowContent = `
                            <td colspan="11"></td>
                            <td>Tổng hợp</td>
                            <td>${totalCost}</td>
                            <td>${totalDeposited}</td>
                            <td class="table-danger">${sub.totalDebt}</td>`;
                rowLast.innerHTML = rowContent;
                tableCycleSub.appendChild(rowLast);
            } catch (error) {
                console.error(error);
            }
        })
        .catch((error) => console.error(error));
};

let createTable = () => {
    let container = document.createElement("div");
    container.classList.add(["container", "p-3"]);
};

btnCall.addEventListener("click", () => {
    callSub();
});
