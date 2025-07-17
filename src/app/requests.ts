export const getFrames = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("image", file);
        const result = await fetch("/api/generate-frames", {
            method: "POST",
            body: formData,
        });
        const data = await result.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }

}