export function config() {
    return {
        name: "pic",
        description: "Display a random picture",
        node_module: [
            "fetch"
        ]
    }
}

export async function main(message, args) {
    const res = await fetch("https://i.pinimg.com/originals/3a/ec/ca/3aeccaca37b026fbdb982f9f52ac202a.jpg")
    message.reply({attachments: [{filename: "image.jpg", data:new Uint8Array(await res.arrayBuffer())}]});
}