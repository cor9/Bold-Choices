document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('wheel-container');
    console.log("1. container:", container);

    if (container) {
        try {
            const props = { items: [{ label: 'Test' }] };
            const wheel = new Wheel(container, props);
            console.log("2. Wheel created:", wheel);
        } catch (error) {
            console.error("3. Error:", error);
        }
    } else {
        console.error("4. Container not found");
    }
});
