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
	props: ["productList"],
	methods: {}
});
app.component("cart", {
	template: ` <div class="text-end">
                    <button class="btn btn-outline-danger" type="button" @click="deleteAllCarts">清空購物車</button>
                </div>
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th></th>
                            <th>品名</th>
                            <th style="width: 150px">數量/單位</th>
                            <th>單價</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="1">
                            <tr>
                                <td>
                                    <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                                        <i class="fas fa-spinner fa-pulse"></i>
                                        x
                                    </button>
                                </td>
                                <td>
                                    <div class="text-success">已套用優惠券</div>
                                </td>
                                <td>
                                    <div class="input-group input-group-sm">
                                        <div class="input-group mb-3">
                                            <input  @blur="updateCart(item)" min="1" type="number" class="form-control" />
                                            <span class="input-group-text" id="basic-addon2"></span>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-end">
                                    <small class="text-success">折扣價：</small>
                                    
                                </td>
                            </tr>
                        </template>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end">總計</td>
                            <td class="text-end"></td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end text-success">折扣價</td>
                            <td class="text-end text-success"></td>
                        </tr>
                    </tfoot>
                </table>`,
	props: [],
	data() {
		return {};
	},
	methods: {},
	mounted() {}
});
app.component("cartform", {
	template: ` <v-form ref="form" class="col-md-6" @submit="createOrder">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <v-field id="email" name="email" type="email" class="form-control" placeholder="請輸入 Email" rules="email|required" ></v-field>
                        <error-message name="email" class="invalid-feedback"></error-message>
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">收件人姓名</label>
                        <v-field id="name" name="姓名" type="text" class="form-control" placeholder="請輸入姓名" rules="required"></v-field>
                        <error-message name="姓名" class="invalid-feedback"></error-message>
                    </div>

                    <div class="mb-3">
                        <label for="tel" class="form-label">收件人電話</label>
                        <v-field id="tel" name="電話" type="text" class="form-control" placeholder="請輸入電話" rules="required|min:8|max:10"></v-field>
                        <error-message name="電話" class="invalid-feedback"></error-message>
                    </div>

                    <div class="mb-3">
                        <label for="address" class="form-label">收件人地址</label>
                        <v-field id="address" name="地址" type="text" class="form-control" placeholder="請輸入地址" rules="required"></v-field>
                        <error-message name="地址" class="invalid-feedback"></error-message>
                    </div>

                    <div class="mb-3">
                        <label for="message" class="form-label">留言</label>
                        <textarea name="" id="message" class="form-control" cols="30" rows="10"></textarea>
                    </div>
                    <div class="text-end">
                        <button type="submit" class="btn btn-danger">送出訂單</button>
                    </div>
                </v-form>`,
	props: [],
	data() {
		return {};
	},
	methods: {},
	mounted() {}
});

app.mount("#app");
