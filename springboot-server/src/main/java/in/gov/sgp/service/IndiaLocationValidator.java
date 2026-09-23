package in.gov.sgp.service;

import org.springframework.stereotype.Component;

/**
 * Validates coordinates against a simplified national boundary polygon.
 *
 * The polygon is intentionally kept in application code so complaint
 * submission does not depend on reverse geocoding or an external API.
 */
@Component
public class IndiaLocationValidator {

    private static final double MIN_LATITUDE = 6.0;
    private static final double MAX_LATITUDE = 37.5;
    private static final double MIN_LONGITUDE = 68.0;
    private static final double MAX_LONGITUDE = 97.5;

    // Longitude, latitude pairs tracing India's mainland and northeastern
    // boundary at a resolution appropriate for complaint-location validation.
    private static final double[][] INDIA_BOUNDARY = {
            {68.1, 23.6}, {68.8, 24.2}, {70.2, 24.6}, {71.5, 24.1},
            {72.6, 24.7}, {73.4, 26.0}, {74.5, 27.0}, {75.7, 28.2},
            {76.5, 29.4}, {77.4, 30.5}, {78.5, 31.5}, {79.4, 32.6},
            {80.2, 34.0}, {81.2, 35.2}, {83.0, 35.8}, {85.0, 35.5},
            {87.2, 30.5}, {88.4, 28.5}, {89.8, 27.0}, {91.5, 26.0},
            {93.2, 26.0}, {94.5, 27.0}, {95.2, 28.0}, {94.4, 25.0},
            {93.2, 23.0}, {92.3, 22.0}, {91.0, 21.6}, {89.7, 22.2},
            {88.4, 21.5}, {87.2, 21.0}, {86.0, 20.0}, {85.0, 19.0},
            {84.0, 18.0}, {83.0, 17.0}, {82.0, 16.0}, {81.0, 14.8},
            {80.0, 12.8}, {78.5, 9.5}, {76.5, 8.0}, {74.0, 9.0},
            {73.0, 11.5}, {72.0, 14.5}, {70.5, 17.5}, {69.0, 20.0}
    };

    public boolean isWithinIndia(Double latitude, Double longitude) {
        if (latitude == null || longitude == null ||
                !Double.isFinite(latitude) || !Double.isFinite(longitude) ||
                latitude < -90 || latitude > 90 ||
                longitude < -180 || longitude > 180) {
            return false;
        }

        if (latitude < MIN_LATITUDE || latitude > MAX_LATITUDE ||
                longitude < MIN_LONGITUDE || longitude > MAX_LONGITUDE) {
            return false;
        }

        boolean inside = false;
        for (int i = 0, j = INDIA_BOUNDARY.length - 1;
             i < INDIA_BOUNDARY.length;
             j = i++) {
            double xi = INDIA_BOUNDARY[i][0];
            double yi = INDIA_BOUNDARY[i][1];
            double xj = INDIA_BOUNDARY[j][0];
            double yj = INDIA_BOUNDARY[j][1];

            boolean crossesLatitude = (yi > latitude) != (yj > latitude);
            if (crossesLatitude) {
                double intersectionLongitude =
                        (xj - xi) * (latitude - yi) / (yj - yi) + xi;
                if (longitude < intersectionLongitude) {
                    inside = !inside;
                }
            }
        }

        return inside;
    }
}
