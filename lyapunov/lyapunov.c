// Mandelbrot CUDA

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ITER 100

// a, b in [0,4]
double compute_lyapunov_exponent(char *iteration_seq, double a, double b)
{
    if (a < 0.0 || 4.0 < a) return NAN;
    if (b < 0.0 || 4.0 < b) return NAN;

    int period = (int) strlen(iteration_seq);
    double x, x_prev;
    double r, psum;

    x_prev = 0.5;
    psum = 0.0;

    for (int i = 1; i < MAX_ITER; i++) {
        r = (iteration_seq[(i - 1) % period] == 'A') ? a : b;
        x = r * x_prev * (1.0 - x_prev);
        psum += log(fabs(r * (1.0 - 2.0 * x)));
        x_prev = x;
    }

    return psum / ((double) MAX_ITER);
}

void color_pixel(unsigned char color[], double lambda)
{
    double k;

    if (isnan(lambda)) {
        // Out of bounds, color black
        color[0] = 0x00;
        color[1] = 0x00;
        color[2] = 0x00;
    } else if (!isfinite(lambda)) {
        // Infinite, color black
        color[0] = 0x00;
        color[1] = 0x00;
        color[2] = 0x00;
    } else if (lambda < 0.0) {
        // Stable, color greyscale
        k = floor(256.0 * exp(4.0 * lambda));
        color[0] = (unsigned char) k;
        color[1] = (unsigned char) k;
        color[2] = (unsigned char) k;
        // color[0] = 0x88;
        // color[1] = 0x88;
        // color[2] = 0x88;
    } else if (lambda == 0.0) {
        color[0] = 0xff;
        color[1] = 0xff;
        color[2] = 0xff;
    } else if (lambda > 0.0) {
        // Chaotic, color blue
        k = 255.0 - floor(256.0 * exp(4.0 * lambda));
        color[0] = (unsigned char) 0.0;
        color[1] = (unsigned char) 0.0;
        color[2] = (unsigned char) k;
    }
}

int main(int argc, char *argv[])
{
    char *iteration_seq;
    // if (argc <= 1) iteration_seq = "AB";
    if (argc <= 1) iteration_seq = "BBBBBBAAAAAA";
    else {
        iteration_seq = (char *) malloc(strlen(argv[1]) * sizeof(char));
        strcpy(iteration_seq, argv[1]);
    }

    int image_width = 1440;
    int image_height = 900;
    int x, y;
    double a, b, lambda;
    double view_left = 3.4;
    double view_width = 0.6;
    double view_bottom = 2.5;
    double view_height = 0.9;

    FILE *fp = fopen("lyapunov.ppm", "wb");
    (void) fprintf(fp, "P6\n%d %d\n255\n", image_width, image_height);
    for (y = 0; y < image_height; y++) {
        b = (((double) y + 0.5) / ((double) image_height)) * view_height + view_bottom;
        for (x = 0; x < image_width; x++) {
            a = (((double) x + 0.5) / ((double) image_width)) * view_width + view_left;
            lambda = compute_lyapunov_exponent(iteration_seq, a, b);
            static unsigned char color[3];
            color_pixel(color, lambda);
            (void) fwrite(color, 1, 3, fp);
            // printf("%f\n", lambda);
        }
    }
    (void) fclose(fp);
    // if (iteration_seq) free(iteration_seq);

    return EXIT_SUCCESS;
}
