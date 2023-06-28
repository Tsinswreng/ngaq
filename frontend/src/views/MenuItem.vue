<script setup lang="ts">
//<script setup> 中的代码会在每次组件实例被创建的时候执行。
const props = defineProps(['item', 'collapsed'])
</script>

<template>
<!-- href="#" 指定了一个空的链接地址。@click.prevent 是一个事件监听器，它会阻止链接的默认行为（即不进行页面跳转），
并调用 props.item.onClick 方法。 -->
	<a href="#" @click.prevent="props.item.onClick">
		<div class="item">
<!-- 这是使用 Font Awesome 图标库来显示图标的代码。:icon 是一个属性绑定，
它将 ['fa-solid', props.item.icon] 作为图标的值传递给 font-awesome-icon 组件。size="2x" 则设置图标的大小为 2 倍。 -->
			<!-- <font-awesome-icon :icon="['fa-solid', props.item.icon]" size="2x"/> -->
<!-- v-if="!collapsed" 是一个条件渲染指令，只有在 collapsed 为 false（即不折叠）时才会显示这个元素。 -->
			<div class="item__title" v-if="!collapsed">
<!-- 这是一个插值表达式，用于显示 props.item.title 的值，即项目的标题文本。 -->
				{{ props.item.title }}
			</div>
		</div>
	</a>
</template>

<!-- 通过上述代码，该组件会生成一个包含项目图标和标题的链接元素。
点击链接时，会调用 props.item.onClick 方法。同时，如果 collapsed 为 false，则会显示项目的标题。 -->

<style scoped>

a{
/* 这行代码指定了链接的文本修饰样式。none 表示没有任何文本修饰，例如没有下划线或删除线。 */
	text-decoration: none;
/* 这行代码指定了链接元素的显示方式为块级元素。块级元素会独占一行，并允许设置宽度、高度、边距等属性。 */
	display: block;
/* 使用自定义属性 --separacion 的值作为上下边距的大小 
margin 属性可以指定多个值来设置元素的外边距。这些值按顺序应用于上、右、下和左的边距。
当只提供两个值时，第一个值应用于上下边距，第二个值应用于左右边距。
*/
	margin: var(--separacion) 0;
}

/* .item:hover .item__title：这是一个后代选择器，选择在鼠标悬停在 .item 元素上时，其内部的 .item__title 元素。 */
.item:hover /* .item__title */{
	/* */
	/* color: var(--colorNegroRelax); */
	color: black;
	/* background-color: var(--colorBlancoRelax); */
	background-color: var(--highLight);
}
.item:hover .item__title{
	color: black;
}

.item{
/* 这行代码将元素的显示方式设置为弹性布局。使用弹性布局可以轻松地控制元素的子元素在主轴和交叉轴上的布局和对齐方式。 */
	display: flex;
/* 元素的交叉轴对齐方式。center 表示在交叉轴上将子元素居中对齐，这通常用于垂直居中子元素。 */
	align-items: center;
	padding: 1;/* var(--separacion); */
/* 设置了元素的子元素之间的间隔 */
	/* gap: var(--separacion); */
	gap: 0;
}

.item__icon{
/* rem 是一个相对单位，它相对于根元素的字体大小。这表示该元素的宽度将等于根元素的字体大小乘以 4.4。 */
	width: 4.4rem;
	display: flex;
/* 这行代码指定了元素的主轴对齐方式。center 表示在主轴上将子元素居中对齐，这通常用于水平居中子元素。 */
	justify-content: center;
	align-items: center;
}

.item__title{
	padding: .5rem;
	/* border-radius: var(--redondeo); */
	border-radius: 0;
}



</style>