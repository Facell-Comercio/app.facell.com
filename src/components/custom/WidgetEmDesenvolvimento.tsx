import ilustration from '@/assets/ilustrations/undraw_building_websites.svg';
import { Cog } from 'lucide-react';

export const WidgetEmDesenvolvimento = () => {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='flex gap-3 items-center'>
                <Cog size={26} className='animate-spin' />
                <span className=" text-lg">Em desenvolvimento...</span>
            </div>
            <img src={ilustration} className='w-96 my-8' />
        </div>
    )
}