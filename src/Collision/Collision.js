export default class Collision {
    isInside(firstMetric, secondMetric) {
        if (firstMetric.left < secondMetric.left + secondMetric.width &&
            firstMetric.left + firstMetric.width > secondMetric.left &&
            firstMetric.top < secondMetric.top + secondMetric.height &&
            firstMetric.height + firstMetric.top > secondMetric.top) {
                return true;
            }

        return false
    }
}
