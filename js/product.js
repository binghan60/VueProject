import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = createApp({
	data() {
		return {
			url: "https://ec-course-api.hexschool.io/v2",
			path: "binghank",
			products: [],
			currentProduct: {},
			showModal: false,
			modalStatus: "",
			pagination: {}
		};
	},
	methods: {
		goPage(page) {
			document.querySelector("#loading").style.display = "block";
			axios
				.post(`${this.url}/api/user/check`, null)
				.then((res) => {
					return axios(`${this.url}/api/${this.path}/admin/products?page=${page}`);
				})
				.then((response) => {
					const { products, pagination } = response.data;
					this.products = products;
					this.pagination = pagination;
					this.showModal = false;
					document.querySelector("#loading").style.display = "none";
				})
				.catch((err) => {
					const { success } = err.response.data;
					if (!success) {
						alert("請先登入");
						document.querySelector("#loading").style.display = "none";
						location.href = "index.html";
					}
				});
		},
		openModal(product = "", type) {
			if (type == "create") {
				this.currentProduct = {};
				this.modalStatus = "create";
			} else if ((type = "edit")) {
				this.currentProduct = product;
				this.modalStatus = "edit";
			}
			this.showModal = true;
		},
		createProduct() {
			document.querySelector("#loading").style.display = "block";
			const { currentProduct } = this;
			axios
				.post(`${this.url}/api/${this.path}/admin/product`, { data: currentProduct })
				.then((res) => {
					this.goPage(this.pagination.current_page);
				})
				.catch((err) => alert("新增失敗"));
		},
		editProduct() {
			document.querySelector("#loading").style.display = "block";
			const { currentProduct } = this;

			axios
				.put(`${this.url}/api/${this.path}/admin/product/${currentProduct.id}`, { data: currentProduct })
				.then((res) => {
					this.goPage(this.pagination.current_page);
				})
				.catch((err) => alert("更新失敗"));
		},
		deleteProduct(product) {
			if (confirm(`確認刪除${product.title}`)) {
				document.querySelector("#loading").style.display = "block";
				axios
					.delete(`${this.url}/api/${this.path}/admin/product/${product.id}`)
					.then((res) => {
						this.goPage(this.pagination.current_page);
					})
					.catch((err) => alert("刪除失敗"));
			}
		}
	},
	mounted() {
		const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexVueToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		axios.defaults.headers.common.Authorization = token;
		if (!token) {
			alert("請先登入");
			location.href = "index.html";
		}
		this.goPage(1);
	}
});
app.component("pagination", {
	props: ["pagination"],
	data() {
		const { pagination } = this;
		return {};
	},
	template: `<div class="page">
                    <ul>
                        <li style="width: 50px" @click="goPage(1)">頁首</li>
                        <li @click="goPage(pagination.current_page - 1)">
                            <
                        </li>
                        <li v-for="(page,index) in pagination.total_pages" @click="goPage(page)" :class="{ active: pagination.current_page === index + 1 }">{{page}}</li>
                        <li @click="goPage(pagination.current_page + 1)">
                            >
                        </li>
                        <li style="width: 50px"  @click="goPage(pagination.total_pages)">頁尾</li>
                    </ul>
                </div>`,
	methods: {
		goPage(page) {
			if (page == this.pagination.current_page) {
				return;
			}
			if (page < 1 || page > this.pagination.total_pages) {
				return;
			}
			this.pagination.current_page = page;
			this.$emit("go-page", page);
		}
	},
	mounted() {}
});

app.mount("#app");
