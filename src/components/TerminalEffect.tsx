import { useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const parseANSIColor = (text: string) => {
    const colorMap: { [key: string]: string } = {
        '32': '#00ff00', // Green
        '33': '#ffff00', // Yellow
        '31': '#ff0000', // Red
        '36': '#00ffff', // Cyan
        '35': '#ff66ff', // Pink/Magenta
        '0': '#ffffff',  // Reset to white instead of green
    };

    const parts = [];
    let currentColor = '#ffffff'; // Default to white instead of green
    let currentText = '';
    let i = 0;

    while (i < text.length) {
        if (text[i] === '\x1b' && text[i + 1] === '[') {
            if (currentText) {
                parts.push({ text: currentText, color: currentColor });
                currentText = '';
            }

            i += 2;
            let colorCode = '';
            while (text[i] !== 'm' && i < text.length) {
                colorCode += text[i];
                i++;
            }

            // Handle RGB color format
            if (colorCode.startsWith('38;2;')) {
                const [_, __, r, g, b] = colorCode.split(';');
                currentColor = `rgb(${r},${g},${b})`;
            } else {
                currentColor = colorMap[colorCode] || colorMap['0'];
            }
            i++;
        } else {
            currentText += text[i];
            i++;
        }
    }

    if (currentText) {
        parts.push({ text: currentText, color: currentColor });
    }

    return parts;
};

const TerminalScreen = ({ text, progress }: { text: string; progress: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const textureRef = useRef<THREE.CanvasTexture | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frameCountRef = useRef(0);
    const { viewport } = useThree();

    const canvasSize = useMemo(() => ({
        width: 1024,
        height: 1024
    }), []);

    const renderText = useCallback((ctx: CanvasRenderingContext2D, lines: string[]) => {
        const lineHeight = 40;
        const startY = 35;
        const startX = 40;

        // Set text rendering properties for crisp text
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.font = 'bold 32px "Courier New"'; // Made text bold and slightly larger

        lines.forEach((line, i) => {
            const y = startY + (i * lineHeight);
            if (y >= -lineHeight && y <= canvasSize.height) {
                const parts = parseANSIColor(line);
                let x = startX;

                parts.forEach(({ text, color }) => {
                    ctx.save();
                    
                    // Main text with slight shadow
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 2;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.fillStyle = color;
                    ctx.fillText(text, x, y);
                    
                    // Subtle glow effect
                    ctx.shadowBlur = 3;
                    ctx.globalAlpha = 0.7;
                    ctx.fillText(text, x, y);
                    
                    x += ctx.measureText(text).width;
                    ctx.restore();
                });
            }
        });
    }, [canvasSize.height]);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        const ctx = canvas.getContext('2d', {
            alpha: false,
            desynchronized: true
        });

        if (ctx) {
            ctx.imageSmoothingEnabled = false;
            canvasRef.current = canvas;

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            textureRef.current = texture;
        }

        return () => {
            if (textureRef.current) {
                textureRef.current.dispose();
            }
        };
    }, [canvasSize.width, canvasSize.height]);

    useFrame(() => {
        frameCountRef.current += 1;
        if (frameCountRef.current % 2 !== 0) return;

        if (!canvasRef.current || !textureRef.current) return;

        const ctx = canvasRef.current.getContext('2d', {
            alpha: false,
            antialias: false,
        });
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        
        // Darker background for better contrast
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

        const lines = text.split('\n');
        renderText(ctx, lines);

        // Always show progress bar
        const barWidth = canvasSize.width - 80;
        const barHeight = 20;
        const barY = canvasSize.height - 50;

        // Progress bar background with subtle glow
        ctx.shadowColor = '#003311';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(40, barY, barWidth, barHeight);

        // Progress segments with enhanced effect
        const segmentWidth = 20;
        const segmentGap = 2;
        const fillWidth = (Math.min(progress, 100) / 100) * barWidth;
        const numSegments = Math.floor(fillWidth / (segmentWidth + segmentGap));

        ctx.shadowColor = '#00ff44';
        ctx.shadowBlur = 8;
        for (let i = 0; i < numSegments; i++) {
            const x = 40 + (i * (segmentWidth + segmentGap));
            ctx.fillStyle = '#00b344';
            ctx.fillRect(x, barY, segmentWidth, barHeight);
        }

        // Progress text with glow
        ctx.font = 'bold 16px "Courier New"';
        ctx.fillStyle = '#00ff44';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.shadowColor = '#00ff44';
        ctx.shadowBlur = 4;
        ctx.fillText(`${Math.min(Math.round(progress), 100)}%`, canvasSize.width - 40, barY - 5);

        textureRef.current.needsUpdate = true;
    });

    return (
        <mesh
            ref={meshRef}
            scale={[viewport.width * 0.9, viewport.height * 0.9, 1]}
            position={[0, 0, 0]}
        >
            <planeGeometry args={[1, 1]} />
            {textureRef.current && (
                <meshBasicMaterial
                    map={textureRef.current}
                    transparent={false}
                >
                    <primitive attach="map" object={textureRef.current} />
                </meshBasicMaterial>
            )}
        </mesh>
    );
};

const Effects = () => {
    return (
        <EffectComposer multisampling={0}>
            <Bloom
                intensity={0.2}        // Slightly increased from 0.15
                luminanceThreshold={0.2} // Decreased from 0.3 for more glow
                luminanceSmoothing={0.9}
                height={200}
            />
            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0003, 0.0003]}  // Slightly increased from 0.0002
            />
        </EffectComposer>
    );
};

interface TerminalEffectProps {
    text: string;
    progress: number;
}

export const TerminalEffect = ({ text, progress }: TerminalEffectProps) => {
    return (
        <div className="w-full h-full absolute inset-0 bg-black">
            <Canvas dpr={[1, 1.5]}>
                <color attach="background" args={['#000000']} />
                <TerminalScreen text={text} progress={progress} />
                <Effects />
            </Canvas>
        </div>
    );
}; 