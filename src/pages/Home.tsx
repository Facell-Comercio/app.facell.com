import ilustration from '@/assets/ilustrations/undraw_building_websites.svg';

const Home = () => {
    return ( <div className="min-h-full border flex flex-col p-5 justify-center items-center">
        <h1 className="mb-4 font-bold">Em construção</h1>

        <img src={ilustration} className='w-96 my-8'/>
        
    </div> );
}
 
export default Home;