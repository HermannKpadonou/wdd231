const dataUrl = 'data/crops.json';

export async function getCropsData() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.crops;
    } catch (error) {
        console.error("Error fetching crop data:", error);
        return [];
    }
}