export const baseUrl = "http://localhost:5000/api";
//export const baseUrl = "https://b5wj73nk-5000.use2.devtunnels.ms/api";


export const postRequest = async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });

    const data = await response.json();

    if (!response.ok) {
        let message;

        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
        return { error: true, message };
    }

    return data;
};


export const getRequest = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        let message = "Unable to fetch chat...";

        if (data?.message) {
            message = data.message;
        }
        return { error: true, message };
    }

    return data;
};
export const getRequestUser = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        let message = "User does not exist...";

        if (data?.message) {
            message = data.message;
        }
        return { error: true, message };
    }

    return data;
};

export const putRequest = async (url) => {
    const response = await fetch(url,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        let message;

        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
        return { error: true, message };
    }

    return data;
};

export const deleteRequest = async (url) => {
    const response = await fetch(url,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    if (!response.ok) {
        let message;

        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
        return { error: true, message };
    }

    return data;
};