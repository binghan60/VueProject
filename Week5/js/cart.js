const app = Vue.createApp({
	data() {
		return {
			url: "https://ec-course-api.hexschool.io/v2",
			path: "binghank",
			productList: []
		};
	},
	methods: {
		getProduct() {
			axios(`${this.url}/api/${this.path}/products`)
				.then((res) => {
					const { products } = res.data;
					this.productList = products;
				})
				.catch((error) => {
					console.error("Error fetching products:", error);
				});
		}
	},
	mounted() {
		this.getProduct();
	}
});

app.component("productlist", {
	template: `
        <table class="table align-middle">
            <thead>
                <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in productList" :key="item.id">
                    <td style="width: 200px">
                    <div style="height: 100px; background-size: cover; background-position: center" :style="{backgroundImage: 'url(' + item.imageUrl + ')'}"></div>
                    </td>
                    <td>{{ item.title }}</td>
                    <td>
                        <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                        <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                        <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                        <button type="button" class="btn btn-outline-secondary" @click="getProduct(item.id)">
                            <i class="fas fa-spinner fa-pulse"></i>
                            查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger" @click="addToCart(item.id)">
                            <i class="fas fa-spinner fa-pulse"></i>
                            加到購物車
                        </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>`,
	props: ["productList"]
});
app.component("cart", {
	template: ``,
	props: [],
	data() {},
	methods() {},
	mounted() {}
});
app.component("cart", {
	template: ``,
	props: [],
	data() {},
	methods() {},
	mounted() {}
});
app.mount("#app");
