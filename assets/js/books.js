async function initGraphs() {

	// Get the books data from the Reading List repo
	// https://github.com/carey-james/Reading-List
	const data_2022 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2022/books.csv");
	const data_2023 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2023/books.csv");
	const data_2024 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2024/books.csv");

	
}