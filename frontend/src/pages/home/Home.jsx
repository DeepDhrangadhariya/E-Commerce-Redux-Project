import Blogs from "../blogs/Blogs"
import TrendingProducts from "../shop/TrendingProducts"
import Banner from "./Banner"
import Categories from "./Categories"
import DealsSection from "./DealsSection"
import HereSection from "./HereSection"
import PromoBanner from "./PromoBanner"


const Home = () => {
    return (
        <>
            <Banner />
            <Categories />
            <HereSection />
            <TrendingProducts />
            <DealsSection />
            <PromoBanner />
            <Blogs />
        </>
    )
}

export default Home