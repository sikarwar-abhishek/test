import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/src/components/common/ui/dialog";
import Image from "next/image";
import { Button } from "@/src/components/common/ui/button";

export default function GameDetailsModal({
    isOpen,
    onClose,
    game,
    onStart,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100dvw-2rem)] sm:max-w-4xl mx-auto max-h-[calc(100%-2rem)] no-scrollbar overflow-scroll sm:p-10 p-4 bg-white rounded-2xl border-0 shadow-2xl">
                <DialogTitle className="sr-only">{game.title}</DialogTitle>

                <div className="flex flex-col sm:flex-row gap-8 items-center">
                    {/* Left: Game Image */}
                    <div className="relative flex-shrink-0 w-full sm:w-1/2 aspect-square overflow-hidden select-none">
                        <Image
                            src={game.image}
                            alt={game.title}
                            fill
                            className="w-full h-full"
                        />
                    </div>

                    {/* Right: Game Info */}
                    <div className="flex flex-col sm:w-1/2">
                        <h2 className="text-xl sm:text-2xl font-fdemobold mb-1">
                            {game.title}
                        </h2>
                        {game.subtitle && (
                            <p className="text-lg font-fdemoregular mb-2">
                                {game.subtitle}
                            </p>
                        )}

                        <ul className="list-disc pl-5 font-poppins text-[#8C8C8C] space-y-2 text-xs sm:text-sm mb-6">
                            {game.description?.map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                        </ul>

                        <Button
                            className="border-2 flex justify-center items-center gap-2 py-5 text-lg font-semibold rounded-xl
        transition-all duration-300 ease-in-out border-[#4A79FA] bg-white text-[#4A79FA] hover:bg-[#4A79FA] hover:text-white hover:shadow-lg hover:scale-105"
                            onClick={onStart}
                        >
                            Start Now
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
