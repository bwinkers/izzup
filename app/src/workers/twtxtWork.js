onmessage = (e) => {
    // message received from main thread
    // perform heavy calculations here with payload (e.data)
    // multiply payload by 100000000000
    console.log(e)

    Twtxt[e.data.method](e.data.params.url)
}

const spiderFeed = async (url) => {

    // Add URL feed to database

    const response = await fetch(`${url}`)

    for await (const chunk of response.body.values()) {
        // Do something with each "chunk"
        console.log(chunk)
        var string = new TextDecoder().decode(chunk)
        console.log(string)
    }

    // Fetch the original image
    // fetch(`https://cors.izzup.com/${url}`)
    // // Retrieve its body as ReadableStream
    // .then((response) => {
    // const reader = response.body.getReader();
    // return new ReadableStream({
    //     start(controller) {
    //     return pump();
    //     function pump() {
    //         return reader.read().then(({ done, value }) => {
    //         // When no more data needs to be consumed, close the stream
    //         if (done) {
    //             controller.close();
    //             return;
    //         }
    //         console.log(value)
    //         // Enqueue the next data chunk into our target stream
    //         controller.enqueue(value);
    //         return pump();
    //         });
    //     }
    //     },
    // });
    // })
    // // // Create a new response out of the stream
    // // .then((stream) => new Response(stream))
    // // // Create an object URL for the response
    // // .then((response) => response.blob())
    // // .then((blob) => URL.createObjectURL(blob))
    // // // Update image
    // // .then((url) => console.log((image.src = url)))
    // .catch((err) => console.error(err));

    // Fetch feed
    // const twtxtResponse = await fetch(`https://cors.izzup.com/${url}`)

    // // Get feed text
    // const raw = await twtxtResponse.text();
    
    // Store feed text locally


     // post result back to main thread
     // postMessage({feed: raw})
}

const Twtxt = {
    spiderFeed: spiderFeed
}